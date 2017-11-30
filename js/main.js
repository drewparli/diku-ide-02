d3.select(window).on('load', main);

var dataset;

function main()
{
  // inspiration from: http://bl.ocks.org/enjalot/1525346
  d3.csv("data/dc.csv", function(data)
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


function initGraph()
{

  // set constants
  var h = 400;                      // overall height
  var w = 600;                      // overall width
  var origin = {"x": 50, "y": 200}  // temperature graph

  //initiate the svg graph object
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

  // console.log("svg", svg)

  svg.append("svg:g")
    .attr("id", "tempgraph")

  var tempgraph = d3.select("#tempgraph")

  // make the axes
  tempgraph.append("svg:g")
    .attr("id", "x-axis")
    .attr("class", "axis")

  tempgraph.append("svg:g")
    .attr("id", "y-axis")
    .attr("class", "axis")

  var ax = d3.select("#x-axis")
    .append("svg:line")
    .attr("x1", origin.x)
    .attr("x2", origin.x + 300)
    .attr("y1", origin.y)
    .attr("y2", origin.y)

  var ay = d3.select("#y-axis")
    .append("svg:line")
    .attr("x1", origin.x)
    .attr("x2", origin.x)
    .attr("y1", origin.y)
    .attr("y2", origin.y - 120)
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
        return d.temps
      })
    console.log(polylines)
}