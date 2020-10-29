
var densityChartSvg;
var margin = { top: 30, right: 30, bottom: 30, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
  densityChartSvg = d3.select('#densitychart');
  densityChartSvg.attr("width", (width + margin.left + margin.right + 200))
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + (margin.left + 100) + "," + (margin.top + 300) + ")");

  // Load both files before doing anything else
  Promise.all([d3.csv('data/dummydensitydata.csv')])
    .then(function (values) {
      densityChartData = values[0];
      drawDensityChart(densityChartData);
    })
});


// Draw the densityChart in the #densityChart svg
function drawDensityChart(densityChartData) {
  // add the x Axis
  var x = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, width + 150]);
  densityChartSvg.append("g")
    .attr("transform", "translate(100," + (height + 150) + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  var y = d3.scaleLinear()
    .range([height, -100])

    .domain([0, 0.01]);
  densityChartSvg.append("g")
    .attr("transform", "translate(100,150)")
    .call(d3.axisLeft(y));

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
  var density = kde(densityChartData.map(function (d) { return d.price; }))

  // Plot the area
  densityChartSvg.append("path")
    .attr("class", "mypath")
    .attr("transform", "translate(100,150)")
    .datum(density)
    .attr("fill", "#69b3a2")
    .attr("opacity", ".8")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d", d3.line()
      .curve(d3.curveBasis)
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return y(d[1]); })
    );
}


// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [x, d3.mean(V, function (v) { return kernel(x - v); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}


