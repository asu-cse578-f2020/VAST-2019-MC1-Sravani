var mapSvg;
var mapData;
var timeData;
var topoData;

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
    Promise.all([getMeanData(), getEntropyData(), getMapMeanData()]).then(
      function () {
        drawMap();
      }
    );
  });
});

async function getMapMeanData(
  startDate = "2020-04-06%2000:35:00",
  endDate = "2020-04-06%2001:35:00"
) {
  url =
    "http://localhost:5000/damage/mean/allcategories/" +
    startDate +
    "/" +
    endDate;
  let newdata = await d3.json(
    "http://localhost:5000/damage/mean/allcategories/'2020-04-06%2000:35:00'/'2020-04-06%2001:35:00'"
  );
  console.log("newdata", url, newdata);
}

// Draw the map in the #map svg
function drawMap(dimension) {
  var colorScheme;
  switch (dimension) {
    case "power":
      MapMeanArray = powerMean;
      MapEntropyArray = powerEntropy;
      colorScheme = d3.schemeReds[3];
      break;
    case "buildings":
      MapMeanArray = buildingsMean;
      MapEntropyArray = buildingsEntropy;
      colorScheme = d3.schemeBlues[3];
      break;
    case "medical":
      MapMeanArray = medicalMean;
      MapEntropyArray = medicalEntropy;
      colorScheme = d3.schemeGreens[3];
      break;
    case "shake":
      MapMeanArray = shakeMean;
      MapEntropyArray = shakeEntropy;
      colorScheme = d3.schemePurples[3];
      break;
    case "sewer":
      MapMeanArray = sewerMean;
      MapEntropyArray = sewerEntropy;
      colorScheme = d3.schemeOranges[3];
      break;
    case "roads":
      MapMeanArray = roadsMean;
      MapEntropyArray = roadsEntropy;
      colorScheme = d3.schemePuRd[3];
      break;
    default:
      MapMeanArray = powerMean;
      MapEntropyArray = powerEntropy;
      colorScheme = d3.schemeReds[3];
      break;
  }
  console.log("dimension", dimension, MapMeanArray);
  topoData.features.forEach(function (d) {
    d.val = +Math.floor(Math.random() * (10 - 0 + 1)) + 0;
  });
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
      let val = MapMeanArray[d.properties.Id - 1];
      //console.log(val, colorScale(val));
      return colorScale(val);
    })
    .attr("stroke", "black")
    .attr("stroke-width", (d) => {
      entropyVal = MapEntropyArray[d.properties.Id - 1];
      if (entropyVal >= 0 && entropyVal <= 0.3) return 4;
      if (entropyVal >= 0.4 && entropyVal <= 0.7) return 2;
      if (entropyVal >= 0.8) return 0.5;
    });
}
