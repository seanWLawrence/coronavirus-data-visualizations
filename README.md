# U.S. Coronavirus Data Visualizations

Data visualizations for Covid-19 statistics taken from covidtracking.com's API.

## Features

- Deaths as of Date
  - Bar chart showing rolling sum of deaths
- Deaths by State
  - Choropleth map showing total deaths by state
- Hospitalizations - Alive vs. Deceased
  - Pie chart showing percentage and sum of alive vs. deceased patients that
      were hospitalized
- Test Results - Positive vs. Negative
    - Pie chart showing percentage and sum of positive vs. negative test results

## How it works

- Node script pulls data and saves in public folder as json files, preformatted
    for data visualization
- Jenkins server runs in EC2 instance and runs the build script daily to ensure
    the data is at least 24 hours up to date
- Jenkins also rebuilds the site through a GitHub webhook that gets triggered on
    a push to this repo

## TODO

- Make map more responsive
- Make page mobile responsive

## Tech stack

- React 
- TypeScript
- Node
- Nivo

## License

MIT

## Author

Sean W. Lawrence
