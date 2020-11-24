
import { convertDateToTimeStamp, getDataForAllCategories } from './utils.js';
import {updateMapData} from './map.js'

var densityChartSvg;
var brush;
var gBrush;
let interval;
let brushMinExtent, brushMaxExtent;
var margin = { top: 30, right: 30, bottom: 30, left: 50 },
  width = 900 - margin.left - margin.right,
  height = 120 - margin.top - margin.bottom;

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
  densityChartSvg = d3.select('#densitychart');
  densityChartSvg.attr("width", (width + margin.left + margin.right + 200))
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + (margin.left + 100) + "," + (margin.top + 300) + ")");

  fetch("http://localhost:5000/reportcount")
    .then((response) => {
      response.json().then(function (data) {
        drawDensityChart(data);
      });
    })
});


document.getElementById("playbtn").addEventListener('click', function () {
  playClicked();
});

document.getElementById("pausebtn").addEventListener('click', function () {
  pauseClicked();
});

// let i = 0;
function playClicked() {
  // console.log("p", d3.event.selection);
  // console.log(gBrush.extent)
  // console.log("Play Clicked", brush.extent()[1], brush.extent()[0]);
  // brush.extent([270.0185185185185, 491.28703703703707]);


  interval = setInterval(() => {

    if (brushMinExtent <= 1070 && brushMaxExtent <= 1070) {
      gBrush.call(brush.move, [brushMinExtent + 10, brushMaxExtent + 10]);
      // i++;
    }
    else {
      // i = 0;
      brushMinExtent = 100;
      brushMaxExtent = 250;
    }

  }, 500)


  // for (let i = 1; i <= 100; i++) {
  //   setTimeout(() => {
  //     gBrush.call(brush.move, [270.0185185185185 + (i * 10), 491.28703703703707 + (i * 10)]);
  //     // }
  //   }, 3000);
  // }



}

function pauseClicked() {
  clearInterval(interval);
}


// Draw the densityChart in the #densityChart svg
function drawDensityChart(data) {
  let values = data.map(val => ({ time: val.time, log_val: val.log_value }));
  // Add X axis 
  var x = d3.scaleLinear()
    .domain(d3.extent(values, function (d) { return d.time; }))
    .range([0, width + 150]);
  densityChartSvg.append("g")
    .attr("transform", "translate(100," + (height + 150) + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(values, function (d) { return +d.log_val; })])
    .range([height, -100]);
  densityChartSvg.append("g")
    .attr("transform", "translate(100,150)")
    .call(d3.axisLeft(y));


  brush = d3.brushX()
    .extent([[100, 50], [width + 250, height + 150]])
    .on("end", brushmoved);

  // let curve = d3.curveLinear;
  // let area = d3.area()
  // .curve(curve)
  // .x(d => x(d.time))
  // .y0(y(0))
  // .y1(d => y(d.log_val))

  // Add the line
  let lines = densityChartSvg.append("path")
    .attr("transform", "translate(100,150)")
    .datum(values)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function (d) { return x(d.time) })
      .y(function (d) { return y(d.log_val) })
    )


  gBrush = densityChartSvg.append("g")
    .attr("class", "brush")
    .call(brush);


  var brushResizePath = function (d) {
    var e = +(d.type == "e"),
      x = e ? 1 : -1,
      y = height / 2;
    return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
  }

  var handle = gBrush.selectAll(".handle--custom")
    .data([{ type: "w" }, { type: "e" }])
    .enter().append("path")
    .attr("class", "handle--custom")
    .attr("stroke", "#000")
    .attr("cursor", "ew-resize")
    .attr("d", brushResizePath);




  // gBrush.call(brush.move, [1586300000000, 1586350000000].map(x));
  gBrush.call(brush.move, [100, 250]);

  function brushmoved() {
    console.log("BRUSH MOVED");
    var s = d3.event.selection;
    console.log("here", s);
    brushMinExtent = s[0];
    brushMaxExtent = s[1];

    if (s == null) {
      handle.attr("display", "none");
      lines.classed("selected", false);
    } else {
      var sx = s.map(x.invert);
      // console.log("sx", sx);
      let date1 = new Date(sx[0]);
      let date2 = new Date(sx[1]);
      let ts1 = convertDateToTimeStamp(date1);
      let ts2 = convertDateToTimeStamp(date2);
      timeSelected(ts1,ts2);
      console.log(ts1, ts2);


      // console.log(lines);
      // for(line in lines) {
      //   line.classed("selected", function(d) { console.log(d);return s[0] <= d && d <= s[1]; });
      // }
      // lines.classed("selected", function(d) { console.log(d);return s[0] <= d && d <= s[1]; });
      handle.attr("display", null).attr("transform", function (d, i) { return "translate(" + [s[i], - (height - 370) / 4] + ")"; });
    }
  }

  // densityChartSvg.append("path")
  //     .datum(data)
  //     .attr("fill", "steelblue")
  //     .attr("d", area);
}
function timeSelected(ts1, ts2) {
  updateMapData(ts1,ts2)  

}







