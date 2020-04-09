import React, { useState, useEffect, useCallback } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";

import { formattedNumber } from "../lib";
import { Table } from "../components/Table";

export let DeathsByState = () => {
  let [deathsByState, setDeathsByState] = useState([]);
  let [maxDeathsPerState, setMaxDeathsPerState] = useState(0);
  let [minDeathsPerState, setMinDeathsPerState] = useState(0);
  let [usStatesGeo, setUsStatesGeo] = useState<any[]>([]);
  let [domain, setDomain] = useState<number>(0);
  let [scale, setScale] = useState(1000);
  let [xTranslation, setXTranslation] = useState(1.5);
  let [yTranslation, setYTranslation] = useState(1.5);

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
      setDomain(maxDeathsPerState);
      setMinDeathsPerState(minDeathsPerState);
    }

    getData();
  }, []);

  let increaseDomain = useCallback(
    () =>
      domain < maxDeathsPerState - 1750
        ? setDomain(domain + 1750)
        : setDomain(maxDeathsPerState),
    [domain, maxDeathsPerState]
  );

  let decreaseDomain = useCallback(
    () => (domain > 1750 ? setDomain(domain - 1750) : setDomain(100)),
    [domain]
  );

  let resetDomain = useCallback(() => setDomain(maxDeathsPerState), [
    maxDeathsPerState
  ]);

  let increaseScale = useCallback(() => setScale(Math.min(scale + 250, 2000)), [
    scale
  ]);
  let decreaseScale = useCallback(() => setScale(Math.max(scale - 250, 0)), [
    scale
  ]);

  let increaseXTranslation = useCallback(
    () => setXTranslation(Math.min(xTranslation + 0.05, 3)),
    [xTranslation]
  );
  let decreaseXTranslation = useCallback(
    () => setXTranslation(Math.max(xTranslation - 0.05, -3)),
    [xTranslation]
  );

  let increaseYTranslation = useCallback(
    () => setYTranslation(Math.min(yTranslation + 0.05, 3)),
    [yTranslation]
  );
  let decreaseYTranslation = useCallback(
    () => setYTranslation(Math.max(yTranslation - 0.05, -3)),
    [yTranslation]
  );

  return (
    <div style={{ marginBottom: 100 }}>
      <h2>Total U.S. Deaths - By State</h2>
      <p>
        Compares the number of deaths by state. Note: The map does <em>not</em>{" "}
        include Hawaii, Alaska or Puerto Rico.
      </p>

      {usStatesGeo && deathsByState.length > 0 && (
        <>
          <div style={{ minWidth: "90vw", height: "80vh" }}>
            <ResponsiveChoropleth
              data={deathsByState as any[]}
              label="properties.NAME"
              value="deaths"
              valueFormat={formattedNumber}
              features={usStatesGeo as any}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              projectionTranslation={[xTranslation, yTranslation]}
              projectionScale={scale}
              fillColor="white"
              borderWidth={0.25}
              borderColor="#333333"
              colors="reds"
              domain={[minDeathsPerState, domain]}
              // @ts-ignore
              legends={
                domain === maxDeathsPerState
                  ? [
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
                    ]
                  : undefined
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              textAlign: "left",
              justifyContent: "space-around",
              flexWrap: "wrap",
              maxWidth: 700,
              margin: "auto",
              marginBottom: 100
            }}
          >
            <div style={{ maxWidth: 300 }}>
              <h3>Sensitivity</h3>

              <p>
                Since NYC has much higher numbers than every other state, it's a
                bit tricky to see the differences between each state at a
                glance.
              </p>

              <p>
                You can toggle the sensitivity of the color differences below to
                get a more detailed picture.
              </p>

              <p>
                Tap reset to see the legend and accurate representation again.
              </p>

              <button
                className="button--outlined"
                onClick={resetDomain}
                style={{ marginRight: ".5rem" }}
                disabled={domain === maxDeathsPerState}
              >
                Reset &#x21bb;
              </button>

              <button
                className="button--solid"
                style={{ marginRight: ".5rem" }}
                onClick={increaseDomain}
                disabled={domain === maxDeathsPerState}
              >
                Increase &minus;
              </button>

              <button
                className="button--solid"
                onClick={decreaseDomain}
                disabled={domain === 100}
              >
                Decrease &#x2b;
              </button>
            </div>

            <div>
              <div style={{ maxWidth: 300, marginBottom: "1.5rem" }}>
                <h3>Zoom</h3>

                <button
                  className="button--outlined"
                  onClick={decreaseScale}
                  style={{ marginRight: ".5rem" }}
                  disabled={scale === 0}
                >
                  Zoom out &minus;
                </button>

                <button
                  className="button--outlined"
                  onClick={increaseScale}
                  style={{ marginRight: ".5rem" }}
                  disabled={scale === 2000}
                >
                  Zoom in &#x2b;
                </button>
              </div>

              <div style={{ maxWidth: 300 }}>
                <h3>Adjust position</h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: 150
                  }}
                >
                  <button
                    className="button--solid"
                    style={{ marginRight: ".5rem" }}
                    onClick={decreaseYTranslation}
                    disabled={yTranslation === -3}
                  >
                    Up &#8593;
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: 150,
                    margin: "1rem 0"
                  }}
                >
                  <button
                    className="button--outlined"
                    onClick={decreaseXTranslation}
                    style={{ marginRight: ".5rem" }}
                    disabled={xTranslation === -3}
                  >
                    &#8592; Left
                  </button>

                  <button
                    className="button--solid"
                    onClick={increaseXTranslation}
                    disabled={xTranslation === 3}
                  >
                    Right &#8594;
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: 150
                  }}
                >
                  <button
                    className="button--solid"
                    disabled={yTranslation === 3}
                    onClick={increaseYTranslation}
                  >
                    Down &#8595;
                  </button>
                </div>
              </div>
            </div>
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
