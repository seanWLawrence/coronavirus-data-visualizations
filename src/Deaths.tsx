import React, { useRef, useState, useEffect } from "react";
import { VIZ_WIDTH, VIZ_HEIGHT } from "./constants";
import { formattedNumber } from "./lib";
import {
  extent,
  scaleLinear,
  scaleTime,
  select,
  axisLeft,
  axisBottom
} from "d3";

interface DeathsNode {
  x: number;
  y: number;
  deaths: number;
  height: number;
  date: Date;
  fill: string;
}

let margin = { left: 50, top: 20, bottom: 20, right: 5 };

export let Deaths = () => {
  let [deaths, setDeaths] = useState<any[]>([]);
  let [totalDeaths, setTotalDeaths] = useState<string | null>(null);
  let xAxisRef = useRef(null);
  let yAxisRef = useRef(null);

  useEffect(() => {
    async function getdeaths() {
      let response = await fetch(process.env.PUBLIC_URL + "/totalDeaths.json");

      let {
        data: { deaths, totalDeaths }
      } = await response.json();

      setDeaths(deaths);
      setTotalDeaths(formattedNumber(totalDeaths));
    }

    getdeaths();
  }, []);

  useEffect(() => {
    if (deaths) {
      let xExtent = extent(deaths, d => new Date(d.date));
      let xScale = scaleTime()
        .domain(xExtent as [Date, Date])
        .range([margin.left, VIZ_WIDTH - margin.right]);
      let xAxis = axisBottom(xScale).ticks(5);

      let yExtent = extent(deaths, d => d.deaths);
      let yScale = scaleLinear()
        .domain(yExtent as [number, number])
        .range([VIZ_HEIGHT - margin.bottom, margin.top]);
      let yAxis = axisLeft(yScale);

      select((xAxisRef.current as unknown) as SVGSVGElement).call(xAxis);
      select((yAxisRef.current as unknown) as SVGSVGElement).call(yAxis);
    }
  }, [deaths]);

  let columnWidth = VIZ_WIDTH / deaths.length;

  return (
    <div>
      <div>
        <h2>Total U.S. Deaths: {totalDeaths}</h2>
      </div>

      <h2>Total U.S Deaths by Date</h2>

      <div style={{ maxWidth: "90vw", margin: "auto" }}>
        <svg viewBox={`0, 0, ${VIZ_WIDTH}, ${VIZ_HEIGHT}`}>
          <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
          <g
            ref={xAxisRef}
            transform={`translate(0, ${VIZ_HEIGHT - margin.bottom})`}
          />
          {deaths.map(({ x, y, height, date, fill }: DeathsNode) => {
            return (
              <rect
                fill={fill}
                key={date.toString()}
                width={columnWidth}
                height={height - margin.bottom}
                x={x - 20}
                y={y}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
