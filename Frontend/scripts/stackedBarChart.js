//import { convertDateToTimeStamp, getDataForAllCategories } from './utils.js';
var svg;
var stackedBarChartData = [];

var margin = { top: 30, right: 30, bottom: 30, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

async function getDataForAllCategories(timestamp1, timestamp2) {
  let response = await fetch(`http://localhost:5000/damage/mean/allcategories/${timestamp1}/${timestamp2}`);
  let data = await response.json();
  let res = data.reduce((ans, val) => {
    return { ...ans, [val['0']]: {} };
  }, {})
  data.forEach(val => {
    res[val[0]][val[1]] = val[2];
    res[val[0]]['total_country'] = val[0];
    if (res[val[0]]['total'] === undefined) {
      res[val[0]]['total'] = val[2];
    } else if (val[2] != null) {
      res[val[0]]['total'] += val[2];
    } else {
      res[val[0]]['total'] += 0;
    }

  })
  return res;
}

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {

  svg = d3.select('#stackedbarchart')
  svg.attr("width", (width + margin.left + margin.right))
    .attr("height", height + margin.top + margin.bottom);

});


function drawchart(t1, t2) {
  getDataForAllCategories(t1, t2).then(data => {
    stackedBarChartData=[];
    for (let key in data) {
      stackedBarChartData.push(data[key])
    }
    drawStackedBarChart(stackedBarChartData);
  });


}

// Draw the stackedBarChart in the #stackedBarChart svg
function drawStackedBarChart(data) {
  data = data.sort((a, b) => { return b.total - a.total });
  data = data.slice(0, 6)
  var y = d3.scaleBand()			// x = d3.scaleBand()	
    .domain(data.map(function a(d) {
      return d.total_country;
    }))
    .range([0, 1.2 * height]);

  var x = d3.scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.total;
      }),
    ])		// y = d3.scaleLinear()
    .rangeRound([0, 1 * width]);	// .rangeRound([height, 0]);
  var z = d3
    .scaleOrdinal()
    .domain(function (data) { return data.columns.slice(0, 5) })
    .range(["#44a2c2", "#eb4034", "#e0c71f", "#a2c7fa", "#4346f7", "#875133",]);

  svg.select('.yaxis').remove();
  svg.select('.xaxis').remove();
  svg.select('.ylabel').remove();
  svg.select('.xlabel').remove();
  // y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},130)`)
    .attr("class", "yaxis")
    .call(d3.axisLeft(y).tickSize(`10`));

  svg.append("text")
    .attr("class","ylabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - (height / 1))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Countries");

  // x-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},${1.582* height})`)
    .attr("class", "xaxis")
    .call(d3.axisBottom(x).tickSize(`10`));

  svg.append("text")
  .attr("class","xlabel")
    .attr("transform",
      "translate(" + (width / 1.5) + " ," +
      (1.3*height + margin.top + 120) + ")")
    .style("text-anchor", "middle")
    .text("Intensities");

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let legend = svg.append('g')
    .attr("transform", `translate(${margin.left},${0})`)

  legend.append("circle").attr("cx", 425).attr("cy", 175).attr("r", 6).style("fill", "#eb4034")
  legend.append("text").attr("x", 450).attr("y", 178).text('shake_intensity')

  legend.append("circle").attr("cx", 425).attr("cy", 200).attr("r", 6).style("fill", "#e0c71f")
  legend.append("text").attr("x", 450).attr("y", 203).text('medical')

  legend.append("circle").attr("cx", 425).attr("cy", 225).attr("r", 6).style("fill", "#a2c7fa")
  legend.append("text").attr("x", 450).attr("y", 228).text('power')

  legend.append("circle").attr("cx", 425).attr("cy", 250).attr("r", 6).style("fill", "#4346f7")
  legend.append("text").attr("x", 450).attr("y", 253).text('buildings')

  legend.append("circle").attr("cx", 425).attr("cy", 275).attr("r", 6).style("fill", "#875133")
  legend.append("text").attr("x", 450).attr("y", 278).text('sewer_and_water')

  legend.append("circle").attr("cx", 425).attr("cy", 300).attr("r", 6).style("fill", "#44a2c2")
  legend.append("text").attr("x", 450).attr("y", 303).text('roads_and_bridges')

  var series = d3.stack().keys(["shake_intensity", "medical", "power", "buildings", "sewer_and_water", "roads_and_bridges"])(data).map(d => (d.forEach(v => v.key = d.key), d));
  svg.append("g")
    .selectAll("g")
    .data(series)
    .enter().append("g")
    .attr("fill", function (d) { return z(d.key); })
    .selectAll("rect")
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("y", function (d) { return y(d.data.total_country); })	    //.attr("x", function(d) { return x(d.data.State); })
    .attr("x", function (d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })	
    .attr("width", function (d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("height", 40)
    .attr("transform", `translate(${margin.left},${margin.top + 115})`)
    .style("cursor", "pointer")
    .on('mouseover', function (d, i) {
      tooltip.style('class', '.tooltip')
        .text(function () {
          return "value: " + (`${(d[1] - d[0]).toFixed(2)}`);
        })
        .style('opacity', 1)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 30) + "px")

    })
    .on('mousemove', function (d, i) {
      // console.log('mousemove on ' + d.properties.name);
    })
    .on('mouseout', function (d, i) {
      tooltip.style('opacity', 0)
    });





}




