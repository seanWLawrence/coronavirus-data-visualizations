let path = require("path");
let { writeJsonSync } = require("fs-extra");
let fetch = require("isomorphic-fetch");
// let {
//   scaleOrdinal,
//   schemeSet1,
//   arc,
//   scaleTime,
//   scaleLinear,
//   extent,
//   pie
// } = require("d3");

const US_HISTORY_API_URL = "https://covidtracking.com/api/v1/states/daily.json";
const margin = { left: 50, top: 20, bottom: 20, right: 5 };
const [VIZ_HEIGHT, VIZ_WIDTH] = [300, 700];

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
  let deaths = data.map(({ death: deaths, date }) => {
    return { date: toDateString(date), deaths };
  });

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

  let xExtent = extent(deathsByDate, ([date]) => new Date(date));
  let xScale = scaleTime()
    .domain(xExtent)
    .range([margin.left, VIZ_WIDTH - margin.right]);

  let yExtent = extent(deathsByDate, ([, deaths]) => deaths);
  let yScale = scaleLinear()
    .domain(yExtent)
    .range([VIZ_HEIGHT - margin.bottom, margin.top]);

  let colorGenerator = scaleOrdinal(schemeSet1);

  console.log(colorGenerator(0), colorGenerator(1));

  let formattedDeaths = deathsByDate.reduce(
    (nodes, [dateString, deaths], index) => {
      let dateObj = new Date(dateString);

      return [
        ...nodes,
        {
          date: dateObj,
          deaths,
          x: xScale(dateObj),
          y: yScale(deaths),
          height: VIZ_HEIGHT - yScale(deaths),
          fill: colorGenerator(3)
        }
      ];
    },
    []
  );

  let totalDeaths = deathsByDate.reduce(
    (totalDeaths, [, deaths]) => totalDeaths + deaths,
    0
  );

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

  let testResults = [testResultsObj.positive, testResultsObj.negative];

  let totalTestResults = testResults[0] + testResults[1];

  let arcGenerator = arc();
  let colorGenerator = scaleOrdinal(schemeSet1);

  let formattedTestResults = pie()(testResults).map((d, index) => {
    return {
      ...d,
      path: arcGenerator({ innerRadius: 0, outerRadius: 150, ...d }),
      fill: colorGenerator(index),
      percentage: ((testResults[index] / totalTestResults) * 100).toFixed(1)
    };
  });

  writeJsonSync(path.join(PUBLIC_PATH, "totalTestResults.json"), {
    data: { testResults: formattedTestResults, totalTestResults }
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

  let results = [hospitalizedObj.hospitalized, hospitalizedObj.deaths];
  let totalResults = results[0] + results[1];

  let totalHospitalized = hospitalizedObj.hospitalized;
  let totalDeaths = hospitalizedObj.deaths;
  // let arcGenerator = arc();
  // let colorGenerator = scaleOrdinal(schemeSet1);

  // let formattedHospitalized = pie()(results).map((d, index) => {
  //   return {
  //     ...d,
  //     path: arcGenerator({ innerRadius: 0, outerRadius: 150, ...d }),
  //     fill: colorGenerator(index),
  //     percentage: ((results[index] / totalResults) * 100).toFixed(1)
  //   };
  // });
  //
  let formattedHospitalized = [
    {
      id: "Alive",
      label: "Alive",
      value: hospitalizedObj.hospitalized - hospitalizedObj.deaths,
      sliceLabel: formattedNumber(
        hospitalizedObj.hospitalized - hospitalizedObj.deaths
      )
    },
    {
      id: "Deceased",
      label: "Deceased",
      value: hospitalizedObj.deaths,
      sliceLabel: formattedNumber(hospitalizedObj.deaths)
    }
  ];

  writeJsonSync(path.join(PUBLIC_PATH, "totalHospitalizedAndDeaths.json"), {
    data: {
      hospitalized: formattedHospitalized,
      totalHospitalized,
      totalDeaths
    }
  });

  console.log("Wrote totalTestHospitalized.json...");
};

async function main() {
  let response = await fetch(US_HISTORY_API_URL);

  let data = await response.json();

  // updateDeaths(data);
  // updateTestResults(data);
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
