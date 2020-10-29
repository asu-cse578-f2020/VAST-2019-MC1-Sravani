
var lineChartSvg;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
  lineChartSvg = d3.select('#lineChart');

  // Load both files before doing anything else
  // Promise.all([d3.json('data/africa.geojson'),
  // d3.csv('data/africa_gdp_per_capita.csv')])
  //   .then(function (values) {

  //     lineChartData = values[0];
  //     timeData = values[1];
      
  //     drawLineChart();
  //   })

});


// Draw the lineChart in the #lineChart svg
function drawLineChart() {

}


