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
    .range([0, 1.3 * height]);

  var x = d3.scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.total;
      }),
    ])		// y = d3.scaleLinear()
    .rangeRound([0, 1.45 * width]);	// .rangeRound([height, 0]);
  var z = d3
    .scaleOrdinal()
    .domain(function (data) { return data.columns.slice(0, 5) })
    .range(["rgb(201,148,199)", "rgb(188,189,220)", "rgb(161,217,155)", "rgb(242,146,114)", "rgb(158,202,225)", "rgb(253,174,107)",]);

  svg.select('.yaxis').remove();
  svg.select('.xaxis').remove();
  svg.select('.ylabel').remove();
  svg.select('.xlabel').remove();
  // y-axis
  const customYAxis =  svg.append("g")
    .attr("transform", `translate(${margin.left},100)`)
    .attr("class", "yaxis")
    .call(d3.axisLeft(y).tickSize(`5`));

  svg.append("text")
    .attr("class","ylabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - (height / 1.2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Countries");


  // x-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},${1.595* height})`)
    .attr("class", "xaxis")
    .call(d3.axisBottom(x).tickSize(`10`));

  svg.append("text")
  .attr("class","xlabel")
    .attr("transform",
      "translate(" + (width/1.35) + " ," +
      (1.2*height + margin.top + 150) + ")")
    .style("text-anchor", "middle")
    .text("Intensities");
  
    d3.selectAll(".yaxis>.tick>text")
    .each(function(d, i){
      d3.select(this).style("font-size",16);
    });

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let legend = svg.append('g')
    .attr("transform", `translate(${margin.left},${0})`)

  legend.append("circle").attr("cx", 10).attr("cy", 25).attr("r", 6).style("fill", "rgb(188,189,220)")
  legend.append("text").attr("x", 25).attr("y", 28).text('shake_intensity')

  legend.append("circle").attr("cx", 225).attr("cy", 25).attr("r", 6).style("fill", "rgb(161,217,155)")
  legend.append("text").attr("x", 240).attr("y", 28).text('medical')

  legend.append("circle").attr("cx", 450).attr("cy", 25).attr("r", 6).style("fill", "#FA8072")
  legend.append("text").attr("x", 465).attr("y", 28).text('power')

  legend.append("circle").attr("cx", 10).attr("cy", 60).attr("r", 6).style("fill", "rgb(158,202,225)")
  legend.append("text").attr("x", 25).attr("y", 63).text('buildings')

  legend.append("circle").attr("cx", 225).attr("cy", 60).attr("r", 6).style("fill", "rgb(253,174,)")
  legend.append("text").attr("x", 240).attr("y", 63).text('sewer_and_water')

  legend.append("circle").attr("cx", 450).attr("cy", 60).attr("r", 6).style("fill", "rgb(201,148,199)")
  legend.append("text").attr("x", 465).attr("y", 63).text('roads_and_bridges')

  var series = d3.stack().keys(["shake_intensity", "medical", "power", "buildings", "sewer_and_water", "roads_and_bridges"])(data).map(d => (d.forEach(v => v.key = d.key), d));
  var bar =  svg.append("g")
    .selectAll("g")
    .data(series);

    bar
    .transition()
      .attr("x", function(d){ return x(d.data['total_country']); })
      .attr("y", function(d){ return y(d[1]); })
      .attr("height", function(d){ return x(d[1]) - x(d[0]); });

    bar.enter().append("g")
    .attr("fill", function (d) { return z(d.key); })
    .selectAll("rect")
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("y", function (d) { return y(d.data.total_country); })	    //.attr("x", function(d) { return x(d.data.State); })
    .attr("x", function (d) { return x(d[0]) })			    //.attr("y", function(d) { return y(d[1]); })	
    .attr("width", function (d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("height", 40)
    .attr("transform", `translate(${margin.left},${margin.top + 85})`)
    .style("cursor", "pointer")
    .on('mouseover', function (d, i) {
      tooltip.style('class', '.tooltip')
        .text(function () {
          console.log(d)
          return "value: " + (`${(d[1] - d[0]).toFixed(2)}`)+"\nTotal Intensity: "+ (`${(d.data.total).toFixed(2)}`);
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




