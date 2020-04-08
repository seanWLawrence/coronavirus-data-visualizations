import React, { useState, useEffect } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";

import { formattedNumber } from "../lib";
import { Table } from "../components/Table";

export let DeathsByState = () => {
  let [deathsByState, setDeathsByState] = useState([]);
  let [maxDeathsPerState, setMaxDeathsPerState] = useState(null);
  let [minDeathsPerState, setMinDeathsPerState] = useState(null);
  let [usStatesGeo, setUsStatesGeo] = useState(null);

  useEffect(() => {
    async function getData() {
      let geoResponse = await fetch(
        process.env.PUBLIC_URL + "/usStatesGeo.json"
      );

      let geoData = await geoResponse.json();

      let deathsResponse = await fetch(
        process.env.PUBLIC_URL + "/deathsByState.json"
      );

      let {
        data: { deathsByState, maxDeathsPerState, minDeathsPerState }
      } = await deathsResponse.json();

      setUsStatesGeo(geoData.features);
      setDeathsByState(deathsByState);
      setMaxDeathsPerState(maxDeathsPerState);
      setMinDeathsPerState(minDeathsPerState);
    }

    getData();
  }, []);

  return (
    <div style={{ marginBottom: 100 }}>
      <h2>Total U.S. Deaths - By State</h2>
      <p>Compares the number of deaths by state.</p>

      {usStatesGeo && deathsByState.length > 0 && (
        <>
          <div style={{ minWidth: "90vw", height: 800 }}>
            <ResponsiveChoropleth
              data={deathsByState as any[]}
              label="properties.NAME"
              value="deaths"
              valueFormat={formattedNumber}
              features={usStatesGeo as any}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              projectionTranslation={[1.75, 1.65]}
              projectionRotation={[0, 0, 0]}
              projectionScale={1300}
              fillColor="white"
              borderWidth={0.25}
              borderColor="#333333"
              colors="reds"
              domain={[
                (minDeathsPerState as unknown) as number,
                (maxDeathsPerState as unknown) as number
              ]}
              // @ts-ignore
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: true,
                  translateX: -200,
                  translateY: -200,
                  itemsSpacing: 0,
                  itemWidth: 150,
                  itemHeight: 18,
                  itemDirection: "left-to-right",
                  itemTextColor: "#444444",
                  itemOpacity: 0.85,
                  symbolSize: 18
                }
              ]}
            />
          </div>
          <h3>Sorted Alphabetically</h3>
          <div
            style={{
              margin: "auto",
              marginTop: "2rem",
              maxWidth: 900,
              display: "flex",
              justifyContent: "space-around"
            }}
          >
            <Table
              headers={deathsByState.map((d: any) => d.state).slice(0, 10)}
              cells={deathsByState
                .map((d: any) => formattedNumber(d.deaths))
                .slice(0, 10)}
            />
            <Table
              headers={deathsByState.map((d: any) => d.state).slice(10, 20)}
              cells={deathsByState
                .map((d: any) => formattedNumber(d.deaths))
                .slice(10, 20)}
            />
            <Table
              headers={deathsByState.map((d: any) => d.state).slice(20, 30)}
              cells={deathsByState
                .map((d: any) => formattedNumber(d.deaths))
                .slice(20, 30)}
            />
            <Table
              headers={deathsByState.map((d: any) => d.state).slice(30, 40)}
              cells={deathsByState
                .map((d: any) => formattedNumber(d.deaths))
                .slice(30, 40)}
            />
            <Table
              headers={deathsByState.map((d: any) => d.state).slice(40, 50)}
              cells={deathsByState
                .map((d: any) => formattedNumber(d.deaths))
                .slice(40, 50)}
            />
            <Table
              headers={deathsByState.map((d: any) => d.state).slice(50)}
              cells={deathsByState
                .map((d: any) => formattedNumber(d.deaths))
                .slice(50)}
            />
          </div>
        </>
      )}
    </div>
  );
};
