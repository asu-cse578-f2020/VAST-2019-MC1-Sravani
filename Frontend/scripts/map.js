import {
  getMeanForGivenCategory,
  getEntropyForGivenCategory,
} from "./utils.js";
import {
  plotfrommap,
} from "./ScatterPlot.js";
var mapSvg;
var mapData;
var topoData;
var MeanArray;
var EntropyArray;
var startTime;
var EndTime;
var Hospitals;
var Bridges;
var Schools;
var Powerplant;
var tooltpdiv;
var clickedCity;

var globalDimension = "power";
function setGlobalDimension(dimension) {
  globalDimension = dimension;
  //console.log("global dim set to", dimension)
  updateMapData(startTime, EndTime);
}
export function getGlobalDimension() {
  return globalDimension;
}

document.getElementById("map-power").addEventListener("click", function () {
  setGlobalDimension("power");
  plotfrommap(globalDimension);
});
document.getElementById("map-buildings").addEventListener("click", function () {
  setGlobalDimension("buildings");
  plotfrommap(globalDimension);
});
document.getElementById("map-medical").addEventListener("click", function () {
  setGlobalDimension("medical");
  plotfrommap(globalDimension);
});
document.getElementById("map-shake").addEventListener("click", function () {
  setGlobalDimension("shake_intensity");
  plotfrommap(globalDimension);
});
document.getElementById("map-sewer").addEventListener("click", function () {
  setGlobalDimension("sewer_and_water");
  plotfrommap(globalDimension);
});
document.getElementById("map-roads").addEventListener("click", function () {
  setGlobalDimension("roads_and_bridges");
  plotfrommap(globalDimension);
});

document
  .getElementById("bridges-checkbox")
  .addEventListener("click", function () {
    var checked = d3.select("#bridges-checkbox").property("checked");
    if (checked) {
      mapSvg.selectAll(".map-bridges").classed("displaynone", false);
      mapSvg.selectAll(".map-power").classed("displaynone", false);
    } else {
      mapSvg.selectAll(".map-bridges").classed("displaynone", true);
      mapSvg.selectAll(".map-power").classed("displaynone", true);
    }
  });

document
  .getElementById("schools-hospitals")
  .addEventListener("click", function () {
    var checked = d3.select("#schools-hospitals").property("checked");
    if (checked) {
      mapSvg.selectAll(".map-schools").classed("displaynone", false);
      mapSvg.selectAll(".map-hospitals").classed("displaynone", false);
    } else {
      mapSvg.selectAll(".map-schools").classed("displaynone", true);
      mapSvg.selectAll(".map-hospitals").classed("displaynone", true);
    }
  });

// This runs when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  mapSvg = d3.select("#map");

  // Load both files before doing anything else
  Promise.all([d3.json("data/StHimark2.json")]).then(function (values) {
    mapData = values[0];
    topoData = topojson.feature(mapData, mapData.objects.StHimark);
    /*
    Promise.all([getMeanData(), getEntropyData()]).then(
      function () {
        //drawMap();
      }
    );
    */
    Hospitals = topoData.features.filter(function (d) {
      return "Hospital" in d.properties;
    });
    Bridges = topoData.features.filter(function (d) {
      return "Bridge" in d.properties;
    });
    Schools = topoData.features.filter(function (d) {
      return "School" in d.properties;
    });
    Powerplant = topoData.features.filter(function (d) {
      return "Powerplant" in d.properties;
    });

    tooltpdiv = d3
      .select("#wrapper")
      .append("g")
      .append("div")
      .attr("class", "maptooltip")
      .style("opacity", 0);
  });
});

export function updateMapData(ts1, ts2) {
  startTime = ts1;
  EndTime = ts2;
  //console.log("mapupdate called")
  Promise.all([
    getMeanForGivenCategory(ts1, ts2, globalDimension),
    getEntropyForGivenCategory(ts1, ts2, globalDimension),
  ]).then(function (values) {
    console.log("result is ", values[0], values[1]);
    MeanArray = values[0];
    EntropyArray = values[1];
    drawMap(MeanArray, EntropyArray);
  });
}

// Draw the map in the #map svg
export function drawMap(
  MapMeanArray = MeanArray,
  MapEntropyArray = EntropyArray
) {
  mapSvg.selectAll(".map-label").remove();
  mapSvg.selectAll(".map-hospitals").remove();
  mapSvg.selectAll(".map-bridges").remove();
  mapSvg.selectAll(".map-schools").remove();
  mapSvg.selectAll(".map-power").remove();

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
    })
    .on("mouseover", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", ".85");
      tooltpdiv.transition().duration(50).style("opacity", 1);
      tooltpdiv
        .html(d.properties.Nbrhood)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mousemove", function (d, i) {
      tooltpdiv
        .html(d.properties.Nbrhood)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).transition().duration("50").attr("opacity", "1");
      tooltpdiv.transition().duration("50").style("opacity", 0);
    })
    .on("click", function (d) {
      console.log("Modal Clicked");

      clickedCity = d.properties.Nbrhood;
      Window.city = d.properties.Nbrhood;
      document.getElementsByClassName("modal-title").innerHTML = clickedCity;
      $("#myModal").modal("show");
      return false;
    });

  mapSvg
    .selectAll(".map-label")
    .data(topoData.features)
    .enter()
    .append("text")
    .attr("class", function (d) {
      return "map-label " + d.properties.Id;
    })
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    })
    .attr("dy", ".15em")
    .text(function (d) {
      return d.properties.Id;
    });

  console.log("Hos", Hospitals, Bridges);
  //Display Hospitals
  mapSvg
    .selectAll(".map-hospitals")
    .data(Hospitals)
    .enter()
    .append("image")
    .attr("xlink:href", "images/hospital.jpg")
    .attr("class", function (d) {
      return "map-hospitals " + d.properties.Id;
    })
    .attr("width", 15)
    .attr("height", 15)
    .attr("y", ".50em")
    .attr("x", "0.3em")
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    });

  //Display Schools
  mapSvg
    .selectAll(".map-schools")
    .data(Schools)
    .enter()
    .append("image")
    .attr("xlink:href", "images/school.png")
    .attr("class", function (d) {
      return "map-schools " + d.properties.Id;
    })
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", "-1.0em")
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    });

  var schools_checked = d3.select("#schools-hospitals").property("checked");
  if (schools_checked) {
    mapSvg.selectAll(".map-schools").classed("displaynone", false);
    mapSvg.selectAll(".map-hospitals").classed("displaynone", false);
  } else {
    mapSvg.selectAll(".map-schools").classed("displaynone", true);
    mapSvg.selectAll(".map-hospitals").classed("displaynone", true);
  }
  //Display Bridges
  mapSvg
    .selectAll(".map-bridges")
    .data(Bridges)
    .enter()
    .append("image")
    .attr("xlink:href", "images/bridges.png")
    .attr("class", function (d) {
      return "map-bridges " + d.properties.Id;
    })
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", "-2.55em")
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    });

  mapSvg
    .selectAll(".map-power")
    .data(Powerplant)
    .enter()
    .append("image")
    .attr("xlink:href", "images/powerplant.jpg")
    .attr("class", function (d) {
      return "map-power " + d.properties.Id;
    })
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", "1.5em")
    .attr("transform", function (d) {
      return "translate(" + path.centroid(d) + ")";
    });

  var bridges_checked = d3.select("#bridges-checkbox").property("checked");
  if (bridges_checked) {
    mapSvg.selectAll(".map-power").classed("displaynone", false);
    mapSvg.selectAll(".map-bridges").classed("displaynone", false);
  } else {
    mapSvg.selectAll(".map-power").classed("displaynone", true);
    mapSvg.selectAll(".map-bridges").classed("displaynone", true);
  }

  var keys = ["low", "Medium", "High"];
  // Add one dot in the legend for each name.
  var size = 20;
  mapSvg
    .selectAll("mydots")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", 50)
    .attr("y", function (d, i) {
      return 400 + i * (size + 5);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d, i) {
      if (i == 0) return colorScale(1);
      if (i == 1) return colorScale(6);
      else return colorScale(9);
    });

  // Add one dot in the legend for each name.
  mapSvg
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 50 + size * 1.2)
    .attr("y", function (d, i) {
      return 400 + i * (size + 5) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
  var certainity = ["uncertain", "certain", "Highly certain"];
  mapSvg
    .selectAll("certainitydots")
    .data(certainity)
    .enter()
    .append("rect")
    .attr("x", 50)
    .attr("y", function (d, i) {
      return 480 + i * (size + 7);
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", (d, i) => {
      if (i == 0) return 0.3;
      if (i == 1) return 3;
      if (i == 2) return 6;
    });

  // Add one dot in the legend for each name.
  mapSvg
    .selectAll("certainitylabels")
    .data(certainity)
    .enter()
    .append("text")
    .attr("x", 50 + size * 1.2)
    .attr("y", function (d, i) {
      return 480 + i * (size + 7) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
