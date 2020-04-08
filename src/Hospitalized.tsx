import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { formattedNumber } from "./lib";

export let Hospitalized = () => {
  let [hospitalized, setHospitalized] = useState([]);
  let [totalHospitalizedAndDeaths, setTotalHospitalizedAndDeaths] = useState({
    hospitalized: null,
    deaths: null
  });

  useEffect(() => {
    async function getData() {
      let response = await fetch(
        process.env.PUBLIC_URL + "/totalHospitalizedAndDeaths.json"
      );

      let {
        data: { hospitalized, totalHospitalized, totalDeaths }
      } = await response.json();

      setHospitalized(hospitalized);
      setTotalHospitalizedAndDeaths({
        hospitalized: totalHospitalized,
        deaths: totalDeaths
      });
    }

    getData();
  }, []);

  console.log(hospitalized);

  return (
    <div>
      <h2>Total U.S. Hospitalized vs. Deaths</h2>
      <p>
        Compares the ratio of people that were hospitalized and still alive with
        the number of deaths.
      </p>
      <aside>
        <p>
          Note: some of the deaths may have been from people that were{" "}
          <em>not</em> hospitalized. This is a rough estimate.
        </p>
      </aside>

      {hospitalized.length > 0 &&
        totalHospitalizedAndDeaths.hospitalized !== null && (
          <>
            <div style={{ margin: "auto", maxWidth: "max-content" }}>
              <table style={{ textAlign: "left" }}>
                <tbody>
                  <tr>
                    <th>Total hospitalized</th>

                    <td style={{ paddingLeft: 10 }}>
                      {formattedNumber(
                        (totalHospitalizedAndDeaths.hospitalized as unknown) as number
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Total alive</th>
                    <td style={{ paddingLeft: 10 }}>
                      {formattedNumber(
                        ((totalHospitalizedAndDeaths.hospitalized as unknown) as number) -
                          ((totalHospitalizedAndDeaths.deaths as unknown) as number)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Total deaths</th>
                    <td style={{ paddingLeft: 10 }}>
                      {formattedNumber(
                        (totalHospitalizedAndDeaths.deaths as unknown) as number
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ minWidth: "90vw", height: 500 }}>
              <ResponsivePie
                data={hospitalized}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                sortByValue
                colors={["#f8e1f4", "#efa8e4"]}
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
                motionStiffness={90}
                motionDamping={15}
                tooltip={({ label, sliceLabel }) => (
                  <span>
                    {label}: <strong>{sliceLabel}</strong>
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
