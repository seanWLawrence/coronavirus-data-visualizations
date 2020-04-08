let path = require("path");
let { writeJsonSync } = require("fs-extra");
let fetch = require("isomorphic-fetch");
let formatDate = require("date-fns/format");
let parseIso = require("date-fns/parseISO");

let DATE_FORMAT = "MM/dd/yyyy";

const US_HISTORY_API_URL = "https://covidtracking.com/api/v1/us/daily.json";

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

const PUBLIC_PATH = path.join(__dirname, "../public");
let toDateString = dateAsIsoNum =>
  [
    String(dateAsIsoNum).slice(0, 4),
    String(dateAsIsoNum).slice(4, 6),
    String(dateAsIsoNum).slice(6, 8)
  ].join("-");

let updateDeaths = data => {
  let deaths = data
    .map(({ death: deaths, date }) => {
      return { date: toDateString(date), deaths };
    })
    .filter(({ deaths }) => deaths > 100);

  let deathsByDate = Object.entries(
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

  let totalDeaths = deathsByDate.reduce(
    (totalDeaths, [, deaths]) => totalDeaths + deaths,
    0
  );

  let formattedDeaths = deathsByDate
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

  writeJsonSync(path.join(PUBLIC_PATH, "totalDeaths.json"), {
    data: { deaths: formattedDeaths, totalDeaths }
  });

  console.log("Wrote totalDeaths.json...");
};

let updateTestResults = data => {
  let testResultsObj = data.reduce(
    (resultsObj, { positive, negative }) => {
      return {
        positive:
          resultsObj.positive + (typeof positive === "number" ? positive : 0),
        negative:
          resultsObj.negative + (typeof negative === "number" ? negative : 0)
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

  writeJsonSync(path.join(PUBLIC_PATH, "totalTestResults.json"), {
    data: {
      testResults: formattedTestResults,
      totalTestResults,
      totalPositive,
      totalNegative
    }
  });

  console.log("Wrote totalTestResults.json...");
};

let updateHospitalized = data => {
  let hospitalizedObj = data.reduce(
    (resultsObj, { hospitalized, death }) => {
      return {
        hospitalized: resultsObj.hospitalized + (hospitalized || 0),
        deaths: resultsObj.deaths + (death || 0)
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

  writeJsonSync(path.join(PUBLIC_PATH, "totalHospitalizedAndDeaths.json"), {
    data: {
      hospitalized: formattedHospitalized,
      totalHospitalized,
      totalAlive,
      totalDeaths
    }
  });

  console.log("Wrote totalTestHospitalized.json...");
};

async function main() {
  let response = await fetch(US_HISTORY_API_URL);

  let data = await response.json();

  updateDeaths(data);
  updateTestResults(data);
  updateHospitalized(data);

  console.log(
    "\n-------------------------------------------------------------"
  );
  console.log(" All done! You have the latest data from covidtracking.com...");
  console.log(
    "-------------------------------------------------------------\n"
  );
}

main();
