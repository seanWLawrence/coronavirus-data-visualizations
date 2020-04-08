import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { formattedNumber } from "./lib";
import { Table } from "./Table";

export let TestResults = () => {
  let [testResults, setTestResults] = useState([]);
  let [totalTestResults, setTotalTestResults] = useState({
    testResults: null,
    positive: null,
    negative: null
  });

  useEffect(() => {
    async function getData() {
      let response = await fetch(
        process.env.PUBLIC_URL + "/totalTestResults.json"
      );

      let {
        data: { testResults, totalTestResults, totalPositive, totalNegative }
      } = await response.json();

      setTestResults(testResults);
      setTotalTestResults({
        testResults: totalTestResults,
        positive: totalPositive,
        negative: totalNegative
      });
    }

    getData();
  }, []);

  return (
    <div style={{ marginBottom: 50 }}>
      <h2>Total U.S. Test Results - Positive vs. Negative</h2>
      <p>
        Compares the ratio of test results that were positive or negative for
        coronavirus.
      </p>

      {testResults.length > 0 && (
        <>
          <div
            style={{
              margin: "auto",
              marginTop: "2rem",
              maxWidth: "max-content"
            }}
          >
            <Table
              headers={[
                "Total test results",
                "Total positive",
                "Total negative"
              ]}
              cells={[
                formattedNumber(totalTestResults.testResults),
                formattedNumber(totalTestResults.positive),
                formattedNumber(totalTestResults.negative)
              ]}
            />
          </div>
          <div style={{ minWidth: "90vw", height: 500 }}>
            <ResponsivePie
              data={testResults}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              sortByValue
              colors={["#679b9b", "#aacfcf"]}
              borderColor={{ theme: "labels.text.fill" }}
              radialLabelsSkipAngle={0}
              radialLabelsTextXOffset={9}
              radialLabelsTextColor="#333"
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={19}
              radialLabelsLinkHorizontalLength={13}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor={{ from: "color" }}
              // @ts-ignore
              sliceLabel={({ sliceLabel }) => sliceLabel}
              slicesLabelsSkipAngle={10}
              slicesLabelsTextWeight={900}
              slicesLabelsTextColor="#333333"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              tooltip={({ label, tooltipLabel }) => (
                <span>
                  {label}: <strong>{tooltipLabel}</strong>
                </span>
              )}
              // @ts-ignore
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  translateY: 56,
                  translateX: 36,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: "#333",
                  symbolSize: 18,
                  symbolShape: "circle"
                }
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};
