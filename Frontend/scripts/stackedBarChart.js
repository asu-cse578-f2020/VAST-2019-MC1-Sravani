
var stackedBarChartSvg;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
  stackedBarChartSvg = d3.select('#stackedBarChart');

  // Load both files before doing anything else
  // Promise.all([d3.json('data/africa.geojson'),
  // d3.csv('data/africa_gdp_per_capita.csv')])
  //   .then(function (values) {

  //     stackedBarChartData = values[0];
  //     timeData = values[1];

  //     drawStackedBarChart();
  //   })

});


// Draw the stackedBarChart in the #stackedBarChart svg
function drawStackedBarChart() {

}


