import React, { FC, useState, useEffect } from "react";
import { VIZ_WIDTH, VIZ_HEIGHT } from "./constants";
import { formattedNumber } from "./lib";

export let TestResults = () => {
  let [testResults, setTestResults] = useState([]);
  let [totalTestResults, setTotalTestResults] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      let response = await fetch(
        process.env.PUBLIC_URL + "/totalTestResults.json"
      );
      let {
        data: { testResults, totalTestResults }
      } = await response.json();

      setTestResults(testResults);
      setTotalTestResults(formattedNumber(totalTestResults));
    }

    getData();
  }, []);

  useEffect(() => {}, [testResults]);

  return (
    <div style={{ margin: "auto", maxWidth: "90vw" }}>
      <div>
        <h2>Total U.S Test Results: {totalTestResults}</h2>
      </div>

      <div>
        <h2>U.S Test Results Positive/Negative Ratio</h2>
      </div>
      <svg viewBox={`0, 0, ${VIZ_WIDTH}, ${VIZ_HEIGHT + 100}`}>
        {testResults.map(
          ({ value, startAngle, path, fill, percentage }, index) => {
            return (
              <g
                key={startAngle}
                style={{ transform: `translate(200px, 200px)` }}
              >
                <path d={path} fill={fill} />
                <text
                  key={value}
                  style={{
                    fontSize: "10px",
                    textAnchor: "middle",
                    fill: "white",
                    transform: `translate(${index === 0 ? -60 : 10}px, ${
                      index === 0 ? -70 : 60
                    }px)`
                  }}
                >
                  {index === 0 ? "Positive" : "Negative"} {percentage}%
                </text>
              </g>
            );
          }
        )}
      </svg>
    </div>
  );
};
