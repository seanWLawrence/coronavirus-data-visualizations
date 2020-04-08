import React from "react";
import { DeathsAsOfDate } from "./visualizations/DeathsAsOfDate";
import { DeathsByState } from "./visualizations/DeathsByState";
import { TestResultsPositiveVsNegative } from "./visualizations/TestResultsPositiveVsNegative";
import { HospitalizedAliveVsDeceased } from "./visualizations/HospitalizedAliveVsDeceased";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div style={{ marginBottom: 50 }}>
        <h1>U.S. Coronavirus / Covid-19 Data Visualizations</h1>
        <p>
          All data is taken from{" "}
          <a href="https://covidtracking.com">Covid Tracking</a>.
        </p>

        <p>
          Written by <a href="https://sean-lawrence.com">Sean W. Lawrence</a>{" "}
          using React, TypeScript, Node and Nivo.{" "}
          <a href="https://github.com/seanWLawrence/coronavirus-data-visualizations">
            View the open source repository
          </a>
        </p>
      </div>

      <DeathsAsOfDate />
      <DeathsByState />
      <TestResultsPositiveVsNegative />
      <HospitalizedAliveVsDeceased />
    </div>
  );
}

export default App;
