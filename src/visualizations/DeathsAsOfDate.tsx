import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";

import { formattedNumber } from "../lib";
import { Table } from "../components/Table";

export let DeathsAsOfDate = () => {
  let [deaths, setDeaths] = useState([]);
  let [totalDeaths, setTotalDeaths] = useState(null);

  useEffect(() => {
    async function getData() {
      let response = await fetch(
        process.env.PUBLIC_URL + "/deathsAsOfDate.json"
      );

      let {
        data: { deaths, totalDeaths }
      } = await response.json();

      setDeaths(deaths);
      setTotalDeaths(totalDeaths);
    }

    getData();
  }, []);

  return (
    <div style={{ marginBottom: 50 }}>
      <h2>Total U.S. Deaths - As of Date</h2>
      <p>Displays the rolling sum of deaths as of specific dates.</p>

      {deaths.length > 0 && (
        <>
          <div
            style={{
              margin: "auto",
              marginTop: "2rem",
              maxWidth: "max-content"
            }}
          >
            <Table
              headers={["Total deaths"]}
              cells={[formattedNumber(totalDeaths)]}
            />
          </div>

          <div style={{ minWidth: "90vw", height: 500 }}>
            <ResponsiveBar
              data={deaths}
              indexBy={({ date }) => date}
              keys={["deaths"]}
              margin={{ top: 50, right: 130, bottom: 150, left: 100 }}
              innerPadding={1}
              colors={["#ffddcc"]}
              borderRadius={2}
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: -90,
                legend: "Date",
                legendPosition: "middle",
                legendOffset: 90
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 2,
                tickRotation: 0,
                legend: "Deaths",
                legendPosition: "middle",
                legendOffset: -50
              }}
              labelSkipWidth={14}
              labelSkipHeight={2}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              // @ts-ignore
              label={d => formattedNumber(d.value)}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              tooltip={({ data: { date, deaths } }) => (
                <span>
                  <strong>{formattedNumber(deaths as number)}</strong> deaths as
                  of <strong>{date}</strong>
                </span>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};
