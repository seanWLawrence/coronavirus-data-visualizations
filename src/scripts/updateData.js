let path = require("path");
let { writeJsonSync, readJsonSync } = require("fs-extra");
let fetch = require("isomorphic-fetch");
let formatDate = require("date-fns/format");
let parseIso = require("date-fns/parseISO");

let DATE_FORMAT = "MM/dd/yyyy";

const US_API_URL = "https://covidtracking.com/api/v1/us/daily.json";
const STATES_API_URL = "https://covidtracking.com/api/v1/states/daily.json";

let toPercentage = (num, totalNum) =>
  ((num / totalNum) * 100).toFixed(0).concat("%");

let formattedNumber = num => {
  let str = num.toString();
  let length = str.length;

  return [...str]
    .reduceRight(
      (formattedStr, char, index) =>
        (length - index) % 3 === 0 && index !== 0
          ? [...formattedStr, "," + char]
          : [...formattedStr, char],
      []
    )
    .reverse()
    .join("");
};

const PUBLIC_PATH = path.join(__dirname, "../../public");
let toDateString = dateAsIsoNum =>
  [
    String(dateAsIsoNum).slice(0, 4),
    String(dateAsIsoNum).slice(4, 6),
    String(dateAsIsoNum).slice(6, 8)
  ].join("-");

let updateDeathsByDate = data => {
  let deaths = data
    .map(({ death: deaths, date }) => {
      return { date: toDateString(date), deaths };
    })
    .filter(({ deaths }) => deaths > 100);

  let deathsAsOfDate = Object.entries(
    deaths.reduce((result, { date, deaths }) => {
      if (result[date] !== undefined) {
        return {
          ...result,
          [date]: result[date] + (deaths || 0)
        };
      }

      return {
        ...result,
        [date]: deaths
      };
    }, {})
  );

  let totalDeaths = Math.max(
    ...deathsAsOfDate.map(([_date, deaths]) => deaths)
  );

  let formattedDeaths = deathsAsOfDate
    .reduce((nodes, [dateString, deaths], index) => {
      return [
        ...nodes,
        {
          dateObj: new Date(dateString),
          date: formatDate(parseIso(dateString), DATE_FORMAT),
          deaths
        }
      ];
    }, [])
    .sort((a, b) => {
      return a.dateObj - b.dateObj;
    })
    .map(({ date, deaths }) => ({ date, deaths }));

  writeJsonSync(path.join(PUBLIC_PATH, "deathsAsOfDate.json"), {
    data: { deaths: formattedDeaths, totalDeaths }
  });

  console.log("Wrote deathsAsOfDate.json...");
};

let updateDeathsByState = data => {
  let deaths = data.map(({ death: deaths, state, fips }) => {
    return { state, deaths, fips };
  });

  let deathsByState = Object.entries(
    deaths.reduce((result, { state, deaths, fips }) => {
      if (result[state] !== undefined) {
        return {
          ...result,
          [state]: {
            ...result[state],
            deaths: Math.max(result[state].deaths, deaths || 0)
          }
        };
      }

      return {
        ...result,
        [state]: { deaths, fips }
      };
    }, {})
  );

  let formattedDeaths = deathsByState.map(([state, { deaths, fips }]) => ({
    id: fips,
    state,
    deaths
  }));

  let maxDeathsPerState = Math.max(
    ...formattedDeaths.map(({ deaths }) => deaths)
  );

  let minDeathsPerState = Math.min(
    ...formattedDeaths.map(({ deaths }) => deaths)
  );

  writeJsonSync(path.join(PUBLIC_PATH, "deathsByState.json"), {
    data: {
      deathsByState: formattedDeaths,
      maxDeathsPerState,
      minDeathsPerState
    }
  });

  let geoData = readJsonSync(path.join(PUBLIC_PATH, "usStatesGeo.json"));

  writeJsonSync(path.join(PUBLIC_PATH, "usStatesGeo.json"), {
    ...geoData,
    features: geoData.features
      .filter(({ properties: { NAME } }) => {
        return !["Hawaii", "Alaska", "Puerto Rico", "Guam"].includes(NAME);
      })
      .map(d => ({
        ...d,
        properties: d.properties,
        geometry: d.geometry,
        id: d.properties.STATE
      }))
  });

  console.log("Wrote deathsByState.json...");
};

let updateTestResultsPositiveVsNegative = data => {
  let testResultsObj = data.reduce(
    (resultsObj, { positive, negative }) => {
      return {
        positive: Math.max(
          resultsObj.positive,
          typeof positive === "number" ? positive : 0
        ),
        negative: Math.max(
          resultsObj.negative,
          typeof negative === "number" ? negative : 0
        )
      };
    },
    { positive: 0, negative: 0 }
  );

  let totalTestResults = testResultsObj.positive + testResultsObj.negative;
  let totalPositive = testResultsObj.positive;
  let totalNegative = testResultsObj.negative;

  let formattedTestResults = [
    {
      id: "Positive",
      label: "Positive",
      value: totalPositive,
      tooltipLabel: `${formattedNumber(totalPositive)} (${toPercentage(
        totalPositive,
        totalTestResults
      )})`,
      sliceLabel: toPercentage(totalPositive, totalTestResults)
    },
    {
      id: "Negative",
      label: "Negative",
      value: totalNegative,
      tooltipLabel: `${formattedNumber(totalNegative)} (${toPercentage(
        totalNegative,
        totalTestResults
      )})`,
      sliceLabel: toPercentage(totalNegative, totalTestResults)
    }
  ];

  writeJsonSync(path.join(PUBLIC_PATH, "testResultsPositiveVsNegative.json"), {
    data: {
      testResults: formattedTestResults,
      totalTestResults,
      totalPositive,
      totalNegative
    }
  });

  console.log("Wrote testResultsPositiveVsNegative.json...");
};

let updateHospitalizedAliveVsDeceased = data => {
  let hospitalizedObj = data.reduce(
    (resultsObj, { hospitalized, death }) => {
      return {
        hospitalized: Math.max(resultsObj.hospitalized, hospitalized || 0),
        deaths: Math.max(resultsObj.deaths, death || 0)
      };
    },
    { hospitalized: 0, deaths: 0 }
  );

  let totalHospitalized = hospitalizedObj.hospitalized;
  let totalDeaths = hospitalizedObj.deaths;
  let totalAlive = totalHospitalized - totalDeaths;

  let formattedHospitalized = [
    {
      id: "Alive",
      label: "Alive",
      value: totalAlive,
      tooltipLabel: `${formattedNumber(totalAlive)} (${toPercentage(
        totalAlive,
        totalHospitalized
      )})`,
      sliceLabel: toPercentage(totalAlive, totalHospitalized)
    },
    {
      id: "Deceased",
      label: "Deceased",
      value: totalDeaths,
      tooltipLabel: `${formattedNumber(totalDeaths)} (${toPercentage(
        totalDeaths,
        totalHospitalized
      )})`,
      sliceLabel: toPercentage(totalDeaths, totalHospitalized)
    }
  ];

  writeJsonSync(path.join(PUBLIC_PATH, "hospitalizedAliveVsDeceased.json"), {
    data: {
      hospitalized: formattedHospitalized,
      totalHospitalized,
      totalAlive,
      totalDeaths
    }
  });

  console.log("Wrote hospitalizedAliveVsDeceased.json...");
};
async function main() {
  let usResponse = await fetch(US_API_URL);
  let statesResponse = await fetch(STATES_API_URL);

  let usData = await usResponse.json();
  let statesData = await statesResponse.json();

  updateDeathsByDate(usData);
  updateDeathsByState(statesData);
  updateTestResultsPositiveVsNegative(usData);
  updateHospitalizedAliveVsDeceased(usData);

  console.log(
    "\n-------------------------------------------------------------"
  );
  console.log(" All done! You have the latest data from covidtracking.com...");
  console.log(
    "-------------------------------------------------------------\n"
  );
}

main();
