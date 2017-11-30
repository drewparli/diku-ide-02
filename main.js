d3.select(window).on('load', main);

var dataset;

function main()
{
  // inspiration from: http://bl.ocks.org/enjalot/1525346
  d3.csv("dc.csv", function(data)
  {
    console.log(data.columns);
    // assignment to global variable to make data available
    dataset = data.map(function(d)
    {
      // d is a row in the dataset
      // console.log(d);
      return {"year": d.YEAR,
              "temps": [d.JAN, d.FEB, d.MAR,
                        d.APR, d.MAY, d.JUN,
                        d.JUL, d.AUG, d.SEP,
                        d.OCT, d.NOV, d.DEC]
      };
    })
    console.log(dataset)
    initGraph()
    lines(dataset);
  })
}

// set constants
var h = 600                       // overall height
var w = 800                       // overall width
var origin = {"x": 50, "y": 200}  // temperature graph
var xScale;
var yScale;


function initGraph()
{

  var tmax = d3.max(dataset, function(d)
  {
    return Math.max.apply(null, d.temps)
  })

  var tmin = d3.min(dataset, function(d)
  {
    return Math.min.apply(null, d.temps)
  })

  console.log("MinMax", tmin, tmax)

  // Insipration for using scales - https://bl.ocks.org/mbostock/3371592

  xScale = d3.scaleLinear()
    .domain([0,11])   // this is the value on the axis
    .range([0, w])  // this is the space allocated the axis
    .nice();

  yScale = d3.scaleLinear()
    .domain([-20, 45])   // this is the value on the axis
    .range([h, 0])  // this is the space allocated the axis
    .nice();

  var xAxis = d3.axisBottom(xScale)
    .ticks(10)

  var yAxis = d3.axisLeft(yScale)
    .ticks(10)


  //initiate the svg graph object
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

  // console.log("svg", svg)

  svg.append("svg:g")
    .attr("class", "axis")
    .attr("fill", "red")
    .call(xAxis)

  svg.append("svg:g")
    .attr("class", "axis")
    .call(yAxis)

  svg.append("svg:g")
    .attr("id", "tempgraph")

  var tempgraph = d3.select("#tempgraph")

  // make the axes
  // tempgraph.append("svg:g")
  //   .attr("id", "x-axis")
  //   .attr("class", "axis")

  // tempgraph.append("svg:g")
  //   .attr("id", "y-axis")
  //   .attr("class", "axis")

  // var ax = d3.select("#x-axis")
  //   .append("svg:line")
  //   .attr("x1", origin.x)
  //   .attr("x2", origin.x + 300)
  //   .attr("y1", origin.y)
  //   .attr("y2", origin.y)

  // var ay = d3.select("#y-axis")
  //   .append("svg:line")
  //   .attr("x1", origin.x)
  //   .attr("x2", origin.x)
  //   .attr("y1", origin.y)
  //   .attr("y2", origin.y - 120)
}


var lines = function(dataset)
{
  var vis = d3.select('#tempgraph')
  console.log("vis", vis)

  var polylines = vis.selectAll("polyline")
    .data(dataset)

  polylines.enter()
    .append("svg:polyline")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("points", function(d,i)
    {
      var pairs = d.temps.map(function(t, i)
        {
          // still need to handle missing data
          // represented as value 999.9
          return "" + xScale(i) + "," + yScale(t)
        })
      console.log(pairs)
      return pairs.join(" ")
    })
  console.log(polylines)
}



var zip = function(x, y)
{
  return [x,y]
}