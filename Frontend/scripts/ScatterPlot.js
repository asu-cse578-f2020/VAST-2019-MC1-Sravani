import {
  getGlobalDimension, getClickedCity
} from "./map.js";

var scatterPlotSvg;

var x ;
var svg;
var y ;
var radiusScale;
var a = NaN;

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
 scatterPlotSvg = d3.select('#scatterplot');
 console.log("")
 
//xScale
x = d3.scaleLinear()
     .range([ 0, 1000]);

//yScale
y = d3.scaleLinear()
    .range([ height, 0]);

//radiusScale    
radiusScale=d3.scaleSqrt();
//var l=document.getElementById("location_val").value;
var lx=getClickedCity();

fetch("http://localhost:5000/reportcountanddamage/"+(lx))
    .then((response) => {
      response.json().then(function (data) {
      

var cP_x=getGlobalDimension()
                 
//data=data.filter(function(d){ return  ((d[cP_x])!=null) }) ;
// console.log(data);
var colorScheme;
var cScheme;
  switch (cP_x) {
    case "power":
      colorScheme = d3.schemeReds[3];
      cScheme="#de2d26";
      break;
    case "buildings":
      colorScheme = d3.schemeBlues[3];
      cScheme="#3182bd";
      break;
    case "medical":
      colorScheme = d3.schemeGreens[3];
      cScheme="#31a354";
      break;
    case "shake_intensity":
      colorScheme = d3.schemePurples[3];
      cScheme="#756bb1";
      break;
    case "sewer_and_water":
      colorScheme = d3.schemeOranges[3];
      cScheme="#e6550d";
      break;
    case "roads_and_bridges":
      colorScheme = d3.schemePuRd[3];
      cScheme="#dd1c77";
      break;
    default:
      colorScheme = d3.schemeReds[3];
      cScheme="#de2d26";
      break;
  }
var colorScale = d3.scaleOrdinal(colorScheme).domain([0, 10]);
 svg=scatterPlotSvg.attr("width", 1000).attr("height", 1000);
 
  x.domain(d3.extent(data, function (d) { 
  let val=new Date(d.time)
  return val; }));
  
  y.domain([0, 10])
  svg.append("g")
  .attr("class", "x_axis")
    .attr("transform", "translate(100," + (height + 150) + ")")
    .call(d3.axisBottom(x));
    
  svg.append("g")
  .attr("class", "y_axis")
     .attr("transform", "translate(100,150)")
     .call(d3.axisLeft(y));
     
       radiusScale.domain(d3.extent(data,function(d) { return d.count; }))
                .range([4,10]);
               // var colorScale = d3.scaleOrdinal(colorScheme).domain([10, 10]);
  
  
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
   
  
      
  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("transform", "translate(100,150)")
      .attr("cx", function (d) { 
      console.log(new Date(d.time));
      return x(d.time); } )
      .attr("cy", function (d) { return y(d[cP_x]); } )
       .attr("r", d => {
      let val = d[cP_x];
   // console.log(val)
      if(val==null)
        {//console.log(val,'in null');
        return 0;}

      else
      {
      //console.log(val);
      return radiusScale(d.count);}
      ;})
      .style("fill",
       cScheme
     // function (d) { return colorScale(d.count);}
      
      )
      .style("cursor", "pointer")
    .on('mouseover', function (d, i) {
      tooltip.style('class', '.tooltip')
        .text(function () {
          return "count: " + (d.count);
        })
        .style('opacity', 1)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")

    })
    .on('mousemove', function (d, i) {
      // console.log('mousemove on ' + d.properties.name);
    })
    .on('mouseout', function (d, i) {
      tooltip.style('opacity', 0)
    })
     
 
     });
    })
    
});


  
 document.addEventListener('input', function() {

 var l=document.getElementById("location_val").value;
 
 //console.log(+l)
 updateData(+l);
 });



// ** Update data section (Called from the onclick)
export function updateData(loc) {
  
//console.log(loc+1)
  fetch("http://localhost:5000/reportcountanddamage/"+(loc))
    .then((response) => {
      response.json().then(function (data) {
      
     // console.log(data);
var l_x="time"
var cP_x=getGlobalDimension()

var colorScheme;
var cScheme;
  switch (cP_x) {
    case "power":
      colorScheme = d3.schemeReds[3];
      cScheme="#de2d26";
      break;
    case "buildings":
      colorScheme = d3.schemeBlues[3];
      cScheme="#3182bd";
      break;
    case "medical":
      colorScheme = d3.schemeGreens[3];
      cScheme="#31a354";
      break;
    case "shake_intensity":
      colorScheme = d3.schemePurples[3];
      cScheme="#756bb1";
      break;
    case "sewer_and_water":
      colorScheme = d3.schemeOranges[3];
      cScheme="#e6550d";
      break;
    case "roads_and_bridges":
      colorScheme = d3.schemePuRd[3];
      cScheme="#dd1c77";
      break;
    default:
      colorScheme = d3.schemeReds[3];
      cScheme="#de2d26";
      break;
  }

//console.log(l_x,cP_x);
svg.selectAll("g").remove()
//data=data.filter(function(d){ return  ((d[cP_x])!=null) }) ;
//console.log(data);

 svg=scatterPlotSvg.attr("width", 1000).attr("height", 1000);
 
  x.domain(d3.extent(data, function (d) {return d[l_x]; }));
  y.domain([0, 10])
  
  svg.append("g").attr("class", "x_axis")
    .attr("transform", "translate(100," + (height + 150) + ")")
    .call(d3.axisBottom(x));
    
  svg.append("g").attr("class", "y_axis")
     .attr("transform", "translate(100,150)")
     .call(d3.axisLeft(y));
     
     radiusScale.domain(d3.extent(data,function(d) { return d.count; }))
                .range([4,10]);
                var colorScale = d3.scaleOrdinal(colorScheme).domain([0, 10]);
                
    var cP_x=getGlobalDimension()



 var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  // Add dots
svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("transform", "translate(100,150)")
    .attr("cx", function (d) { return x(d[l_x]); } )
      .attr("cy", function (d) { return y(d[cP_x]); } )
      .attr("r", d => {
      let val = d[cP_x];
    //console.log(val)
      if(val==null)
        {//console.log(val,'in null');
        return 0;}

      else
      {
      //console.log(val);
      return radiusScale(d.count);}
      ;})
      .style("fill",
      cScheme
      // function (d) { return colorScale(d.count);}
       )
  .on('mouseover', function (d, i) {
      tooltip.style('class', '.tooltip')
        .text(function () {
          return "count: " + (d.count);
        })
        .style('opacity', 1)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")

    })
    .on('mousemove', function (d, i) {
      // console.log('mousemove on ' + d.properties.name);
    })
    .on('mouseout', function (d, i) {
      tooltip.style('opacity', 0)
    })

           
     });
    })

    
}
 
export function plotfrommap(globalDimension){
var l = getClickedCity();
//console.log(l+1);

fetch("http://localhost:5000/reportcountanddamage/"+(l))
.then((response) => {
  response.json().then(function (data) {
       
       
       
       var l_x="time"
var cP_x=globalDimension

var colorScheme;
var cScheme;
  switch (cP_x) {
    case "power":
      colorScheme = d3.schemeReds[3];
      cScheme="#de2d26";
      break;
    case "buildings":
      colorScheme = d3.schemeBlues[3];
      cScheme="#3182bd";
      break;
    case "medical":
      colorScheme = d3.schemeGreens[3];
      cScheme="#31a354";
      break;
    case "shake_intensity":
      colorScheme = d3.schemePurples[3];
      cScheme="#756bb1";
      break;
    case "sewer_and_water":
      colorScheme = d3.schemeOranges[3];
      cScheme="#e6550d";
      break;
    case "roads_and_bridges":
      colorScheme = d3.schemePuRd[3];
      cScheme="#dd1c77";
      break;
    default:
      colorScheme = d3.schemeReds[3];
      cScheme="#de2d26";
      break;
  }

//console.log(l_x,cP_x);
svg.selectAll("g").remove()
//data=data.filter(function(d){ return  ((d[cP_x])!=null) }) ;
//console.log(data);

 svg=scatterPlotSvg.attr("width", 1000).attr("height", 1000);
 
  x.domain(d3.extent(data, function (d) {return d[l_x]; }));
  y.domain([0, 10])
  
  svg.append("g")
  .attr("class", "x_axis")
    .attr("transform", "translate(100," + (height + 150) + ")")
    .call(d3.axisBottom(x));
    
  svg.append("g")
  .attr("class", "y_axis")
     .attr("transform", "translate(100,150)")
     .call(d3.axisLeft(y));
     
      radiusScale.domain(d3.extent(data,function(d) { return d.count; }))
                .range([4,10]);
 var colorScale = d3.scaleOrdinal(colorScheme).domain([0, 10]);
 var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  // Add dots
svg.append('g')
    
    .selectAll("dot")
  .data(data)
    .enter()
    .append("circle")
    .attr("transform", "translate(100,150)")
  .attr("cx", function (d) { return x(d[l_x]); } )
      .attr("cy", function (d) { return y(d[cP_x]); } )
       .attr("r", d => {
      let val = d[cP_x];
   // console.log(val)
      if(val==null)
        {//console.log(val,'in null');
        return 0;}

      else
      {
      //console.log(val);
      return radiusScale(d.count);}
      ;})
      .style("fill", 
      cScheme
     // function (d) { return colorScale(d.count);}
      )
  .on('mouseover', function (d, i) {
      tooltip.style('class', '.tooltip')
        .text(function () {
          return "count: " + (d.count);
        })
        .style('opacity', 1)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")

    })
    .on('mousemove', function (d, i) {
      // console.log('mousemove on ' + d.properties.name);
    })
    .on('mouseout', function (d, i) {
      tooltip.style('opacity', 0)
    })
      
 });
})

}  




