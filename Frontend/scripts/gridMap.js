import { getDataForAllCategories } from "./utils.js";
var gridMapSvg;
var mapData;

// This runs when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  gridMapSvg = d3.select("#gridmap");

  // Load both files before doing anything else
  Promise.all([d3.json("data/gridmap-layout-stHimark.json")]).then(function (
    values
  ) {
    mapData = values[0];
  });
});

function getDateDiff(date1, date2) {
  var timeStamp1 = Date.parse(date1, "YYYY-MM-DD HH:mm:ss");
  var timeStamp2 = Date.parse(date2, "YYYY-MM-DD HH:mm:ss");
  var difference = timeStamp2 - timeStamp1;
  return difference / 6;
}

export function plotGridMap(startInterval, endInterval) {
  var dateDiff = getDateDiff(startInterval, endInterval);
  var timeStamp1 = Date.parse(startInterval, "YYYY-MM-DD HH:mm:ss");

  var svg = gridMapSvg.attr("width", 600).attr("height", 600);
  let damageArray = [
    "power",
    "buildings",
    "medical",
    "shake_intensity",
    "sewer_and_water",
    "roads_and_bridges",
  ];
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
  var colorScale = d3.scaleLinear().domain([0, 10]).range(["white", "maroon"]);

  for (let i = 0; i < 6; i++) {
    setTimeout(function timer() {
      let changedTimestamp1 = moment(timeStamp1 + dateDiff * i).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let changedTimestamp2 = moment(timeStamp1 + dateDiff * (i + 1)).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      getDataForAllCategories(changedTimestamp1, changedTimestamp2).then(
        (data) => {
          console.log(data);
          for (var k = 0; k < mapData.length; k++) {
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
                  let damage = damageArray[j];
                  let strk = (k + 1).toString();
                  if (data[strk]) {
                    if (data[strk][damage] == null) {
                      return colorScale(0);
                    }
                    return colorScale(data[strk][damage]);
                  } else {
                    return colorScale(0);
                  }
                })
                .style("stroke", "black")
                .style("stroke-width", 0.5);
            }
          }
        }
      );
    }, i * 1000);
  }

  for (let i = 0; i < mapData.length; i++) {
    svg
      .append("line")
      .style("stroke", "black")
      .style("stroke-width", 4)
      .attr("x1", 150 * mapData[i].x + 150)
      .attr("y1", 150 * mapData[i].y + 100)
      .attr("x2", 150 * mapData[i].x + 150)
      .attr("y2", 150 * mapData[i].y + 250);
  }

  for (let w = 0; w < mapData.length; w++) {
    svg
      .append("line")
      .style("stroke", "black")
      .style("stroke-width", 4)
      .attr("x1", 150 * mapData[w].x)
      .attr("y1", 150 * mapData[w].y + 250)
      .attr("x2", 150 * mapData[w].x + 150)
      .attr("y2", 150 * mapData[w].y + 250);
  }

  sEnter
    .append("rect")
    .attr("width", 150)
    .attr("height", 150)
    .attr("vector-effect", "non-scaling-stroke")
    .style("stroke", "black")
    .style("stroke-width", 6)
    .style("fill", function (d) {
      return "white";
    })
    .attr("transform", "translate(0,100)");

  sEnter
    .append("text")
    .attr("x", 150 / 2)
    .attr("y", 150 / 2 + 2)
    .style("text-anchor", "middle");
}
