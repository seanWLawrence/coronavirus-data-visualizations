import React from "react";
import { Deaths } from "./Deaths";
import { TestResults } from "./TestResults";
import { Hospitalized } from "./Hospitalized";
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
          <a href="https://giuthub.com/seanWLawrence/coronavirus-data-visualizations">
            View the open source repository
          </a>
        </p>
      </div>

      <Deaths />
      <TestResults />
      <Hospitalized />
    </div>
  );
}

export default App;
