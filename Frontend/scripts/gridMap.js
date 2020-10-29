
var gridMapSvg;

var mapData;
var timeData;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
  gridMapSvg = d3.select('#gridmap');

  // Load both files before doing anything else
  Promise.all([d3.json("data/gridmap-layout-thailand.json")]).then(function (values) {
    mapData = values[0];
    drawGridMap();
  });

});


// Draw the gridMap in the #gridMap svg
function drawGridMap() {

  var svg = gridMapSvg.attr("width", 600).attr("height", 600);

  var sEnter = svg
    .append("g")
    .selectAll("g")
    .data(mapData)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + d.x * 150 + "," + d.y * 150 + ")";
    });

  var lineGraph = d3.select("#gridmap").append("svg:svg");
  var colorScale = d3.scaleOrdinal(d3.schemeReds[3]).domain([0, 10]);

  for (var k = 0; k < mapData.length; k++) {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        lineGraph
          .append("svg:rect")
          .attr("width", 25)
          .attr("height", 25)
          .attr("transform", function (d) {
            return (
              "translate(" +
              (150 * mapData[k].x + i * 25) +
              "," +
              (mapData[k].y * 150 + (j + 4) * 25) +
              ")"
            );
          })
          .style("fill", (d) => {
            let val = +Math.floor(Math.random() * (10 - 0 + 1)) + 0;
            console.log(val, colorScale(val));
            return colorScale(val);
          })
          .style("stroke", "black")
          .style("stroke-width", 0.5);
      }
    }
  }

  sEnter
    .append("rect")
    .attr("width", 150)
    .attr("height", 150)
    .attr("vector-effect", "non-scaling-stroke")
    .style("stroke", "black")
    .style("stroke-width", 7)
    .style("fill", function (d) {
      return "white";
    }).attr("transform", "translate(0,100)");

  sEnter
    .append("text")
    .attr("x", 150 / 2)
    .attr("y", 150 / 2 + 2)
    .style("text-anchor", "middle");

}


