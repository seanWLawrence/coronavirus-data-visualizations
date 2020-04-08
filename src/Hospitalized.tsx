import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { formattedNumber } from "./lib";
import { Table } from "./Table";

export let Hospitalized = () => {
  let [hospitalized, setHospitalized] = useState([]);
  let [totalHospitalizedAndDeaths, setTotalHospitalizedAndDeaths] = useState({
    hospitalized: null,
    alive: null,
    deaths: null
  });

  useEffect(() => {
    async function getData() {
      let response = await fetch(
        process.env.PUBLIC_URL + "/totalHospitalizedAndDeaths.json"
      );

      let {
        data: { hospitalized, totalHospitalized, totalDeaths, totalAlive }
      } = await response.json();

      setHospitalized(hospitalized);
      setTotalHospitalizedAndDeaths({
        hospitalized: totalHospitalized,
        deaths: totalDeaths,
        alive: totalAlive
      });
    }

    getData();
  }, []);

  return (
    <div style={{ marginBottom: 50 }}>
      <h2>Total U.S. Hospitalized - Alive vs. Deceased</h2>
      <p>
        Compares the ratio of people that were hospitalized and still alive with
        the number of deceased.
      </p>
      <aside>
        <p>
          Note: some of the deaths may have been from people that were{" "}
          <em>not</em> hospitalized. This is a rough estimate.
        </p>
      </aside>

      {hospitalized.length > 0 && (
        <>
          <div
            style={{
              margin: "auto",
              marginTop: "2rem",
              maxWidth: "max-content"
            }}
          >
            <Table
              headers={["Total hospitalized", "Total deceased", "Total alive"]}
              cells={[
                formattedNumber(totalHospitalizedAndDeaths.hospitalized),
                formattedNumber(totalHospitalizedAndDeaths.deaths),
                formattedNumber(totalHospitalizedAndDeaths.alive)
              ]}
            />
          </div>
          <div style={{ minWidth: "90vw", height: 500 }}>
            <ResponsivePie
              data={hospitalized}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              sortByValue
              colors={["#dcd6f7", "#a6b1e1"]}
              borderColor={{ theme: "labels.text.fill" }}
              radialLabelsSkipAngle={0}
              radialLabelsTextXOffset={9}
              radialLabelsTextColor="#333"
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={19}
              radialLabelsLinkHorizontalLength={13}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor={{ from: "color" }}
              slicesLabelsSkipAngle={10}
              slicesLabelsTextWeight={900}
              slicesLabelsTextColor="#333333"
              animate={true}
              innerRadius={0.5}
              motionStiffness={90}
              motionDamping={15}
              tooltip={({ label, tooltipLabel }) => (
                <span>
                  {label}: <strong>{tooltipLabel}</strong>
                </span>
              )}
              // @ts-ignore
              sliceLabel={d => d.sliceLabel}
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
