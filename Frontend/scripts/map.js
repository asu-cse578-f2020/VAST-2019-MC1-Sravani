
var mapSvg;
var mapData;
var timeData;
var topoData;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
  mapSvg = d3.select('#map');

  // Load both files before doing anything else
  Promise.all([
    d3.json("data/StHimark2.json"),
    d3.json("data/StHimarkgeo.json"),
  ]).then(function (values) {
    mapData = values[0];
    topoData = topojson.feature(mapData, mapData.objects.StHimark);
    topoData1 = values[1];
    drawMap();
  });

});


// Draw the map in the #map svg
function drawMap() {
  console.log("topoData", topoData);
  topoData.features.forEach(function (d) {
    d.val = +Math.floor(Math.random() * (10 - 0 + 1)) + 0;
  });
  // create the map projection and geoPath
  let projection = d3
    .geoMercator()
    .scale(100000)
    .center(d3.geoCentroid(topoData))
    .translate([
      +mapSvg.style("width").replace("px", "") / 2,
      +mapSvg.style("height").replace("px", "") / 2.3,
    ]);
  let path = d3.geoPath().projection(projection);
  var colorScale = d3.scaleOrdinal(d3.schemeReds[3]).domain([0, 10]);
  let g = mapSvg.append("g");
  g.selectAll("path")
    .data(topoData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("id", (d) => {
      return d.properties.Id;
    })
    .attr("fill", (d) => {
      let val = +Math.floor(Math.random() * (10 - 0 + 1)) + 0;
      console.log(val, colorScale(val));
      return colorScale(val);
    })
    .attr("stroke", "black")
    .attr("stroke-width", (d) => {
      if (d.val >= 0 && d.val <= 3) return 0.5;
      if (d.val >= 4 && d.val <= 7) return 2;
      if (d.val >= 8 && d.val <= 10) return 4;
    });

}


