import { getMeanForGivenCategory, getEntropyForGivenCategory  } from './utils.js';
var mapSvg;
var mapData;
var topoData;
var MeanArray;
var EntropyArray;
var startTime;
var EndTime;

var globalDimension='power';
function setGlobalDimension(dimension){
  globalDimension = dimension;
  //console.log("global dim set to", dimension)
  updateMapData(startTime, EndTime);
}
document.getElementById("map-power").addEventListener('click', function () {
  setGlobalDimension("power");
});
document.getElementById("map-buildings").addEventListener('click', function () {
  setGlobalDimension("buildings");
});
document.getElementById("map-medical").addEventListener('click', function () {
  setGlobalDimension("medical");
});
document.getElementById("map-shake").addEventListener('click', function () {
  setGlobalDimension("shake_intensity");
});
document.getElementById("map-sewer").addEventListener('click', function () {
  setGlobalDimension("sewer_and_water");
});
document.getElementById("map-roads").addEventListener('click', function () {
  setGlobalDimension("roads_and_bridges");
});
/*
document.getElementById("map-power").addEventListener('click', function () {
  setGlobalDimension("map-power");
  drawMap();
});

document.getElementById("map-buildings").addEventListener('click', function () {
  setGlobalDimension("map-power");
  drawMap();
});
*/
// This runs when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  mapSvg = d3.select("#map");

  // Load both files before doing anything else
  Promise.all([
    d3.json("data/StHimark2.json"),
    d3.json("data/StHimarkgeo.json"),
  ]).then(function (values) {
    mapData = values[0];
    topoData = topojson.feature(mapData, mapData.objects.StHimark);
    /*
    Promise.all([getMeanData(), getEntropyData()]).then(
      function () {
        //drawMap();
      }
    );
    */
  });
});

export function updateMapData(ts1,ts2){
  startTime = ts1;
  EndTime = ts2;
  //console.log("mapupdate called")
  Promise.all([
    getMeanForGivenCategory(ts1,ts2, globalDimension),
    getEntropyForGivenCategory(ts1,ts2, globalDimension),
  ]).then(function(values){
    console.log("result is ",values[0], values[1] )
     MeanArray = values[0];
     EntropyArray = values[1];
    drawMap(MeanArray, EntropyArray)
  });
}

// Draw the map in the #map svg
export function drawMap(MapMeanArray=MeanArray, MapEntropyArray=EntropyArray) {
  //let checkeddimension =  d3.select('input').property('checked');
  //console.log(globalDimension, MapMeanArray, MapEntropyArray);  
  var colorScheme;
  switch (globalDimension) {
    case "power":
      colorScheme = d3.schemeReds[3];
      break;
    case "buildings":
      colorScheme = d3.schemeBlues[3];
      break;
    case "medical":
      colorScheme = d3.schemeGreens[3];
      break;
    case "shake_intensity":
      colorScheme = d3.schemePurples[3];
      break;
    case "sewer_and_water":
      colorScheme = d3.schemeOranges[3];
      break;
    case "roads_and_bridges":
      colorScheme = d3.schemePuRd[3];
      break;
    default:
      colorScheme = d3.schemeReds[3];
      break;
  }
  //console.log("dimension", dimension, MapMeanArray);
  // create the map projection and geoPath
  let projection = d3
    .geoMercator()
    .scale(129000)
    .center(d3.geoCentroid(topoData))
    .translate([
      +mapSvg.style("width").replace("px", "") / 2,
      +mapSvg.style("height").replace("px", "") / 2.3,
    ]);
  let path = d3.geoPath().projection(projection);
  var colorScale = d3.scaleOrdinal(colorScheme).domain([0, 10]);
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
      //let val = +Math.floor(Math.random() * (10 - 0 + 1)) + 0;
      let val = MapMeanArray[d.properties.Id];
      //console.log(val, colorScale(val));
      return colorScale(val);
    })
    .attr("stroke", "black")
    .attr("stroke-width", (d) => {
      let entropyVal = MapEntropyArray[d.properties.Id];
      if (entropyVal >= 0 && entropyVal <= 0.4) return 6;
      if (entropyVal >= 0.5 && entropyVal <= 0.7) return 3;
      if (entropyVal >= 0.8) return 0.3;
    });
    
}
