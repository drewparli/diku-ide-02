d3.select(window).on('load', main);

// Global Variables
var h = 400                       // overall height
var w = 1200                       // overall width
var origin = {"x": 50, "y": 200}  // temperature graph
var xScale;
var yScale;
var kbh;


function main()
{
  // inspiration from: http://bl.ocks.org/enjalot/1525346
  d3.csv("kbh.csv", function(data)
  {
    initGraph()
    console.log(data.columns);
    // assignment to global variable to make data available
    kbh = data.map(function(d)
    {
      // d is a single year in the kbh dataset
      var y = d.YEAR
      var t = [d.JAN, d.FEB, d.MAR, d.APR, d.MAY, d.JUN,
               d.JUL, d.AUG, d.SEP, d.OCT, d.NOV, d.DEC]
      var s = mkSegments(t)
      return {"year": y, "temps": t, "segments": s};
    })
    console.log("KBH", kbh)
    addTempLines(kbh)
  })
}

function mkSegments(tempArr)
{
  var i = 0
  var j = 1
  var segments = []

  while (j <= tempArr.length - 1) {
    if (tempArr[i] != 999.9 && tempArr[j] != 999.9)
    {
      console.log("made it")
      s = {
        "x1": xScale(i),
        "y1": yScale(tempArr[i]),
        "x2": xScale(j),
        "y2": yScale(tempArr[j]),
      }
      segments.push(s)
    }
    i += 1
    j += 1
  }

  return segments
}


function initGraph()
{

  // var tmax = d3.max(dataset, function(d)
  // {
  //   return Math.max.apply(null, d.temps)
  // })

  // var tmin = d3.min(dataset, function(d)
  // {
  //   return Math.min.apply(null, d.temps)
  // })

  // console.log("MinMax", tmin, tmax)

  // Insipration for using scales - https://bl.ocks.org/mbostock/3371592

  xScale = d3.scaleLinear()
    .domain([0,11])   // this is the value on the axis
    .range([0, w])  // this is the space allocated the axis
    .nice();

  yScale = d3.scaleLinear()
    .domain([-10, 30])   // this is the value on the axis
    .range([h, 0])  // this is the space allocated the axis
    .nice();

  var xAxis = d3.axisBottom(xScale)
    .ticks(10)

  var yAxis = d3.axisRight(yScale)
    .ticks(10)

  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

  svg.append("svg:g")
    .attr("id", "x-axis")
    .attr("class", "axis")
    .call(xAxis)

  svg.append("svg:g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .call(yAxis)

  svg.append("svg:g")
    .attr("id", "temp-lines")
}


// var lines = function(kbh)
// {
//   var vis = d3.select('#tempgraph')
//   console.log("vis", vis)

//   var polylines = vis.selectAll("polyline")
//     .data(kbh)

//   polylines.enter()
//     .append("svg:polyline")
//     .attr("fill", "none")
//     .attr("stroke", "black")
//     .attr("stroke-width", "1")
//     .attr("points", function(d,i)
//     {
//       var pairs = d.temps.map(function(t, i)
//         {
//           // still need to handle missing data
//           // represented as value 999.9
//           return "" + xScale(i) + "," + yScale(t)
//         })
//       console.log(pairs)
//       return pairs.join(" ")
//     })
//   console.log(polylines)
// }


var addTempLines = function(dataset)
{
  var vis = d3.select('#temp-lines')

  var groups = vis.selectAll("g")
    .data(dataset)

  groups.enter()
    .append("svg:g")
    .attr("class", "temp-line")
    .attr("id", function(d,i)
    {
        return "_" + d.year
    })

  // add line segments for each data point
  dataset.forEach(function(data, i)
    {
    var year = d3.select("#_" + data.year)

    console.log(data.temps)

    var lines = year.selectAll("line")
      .data(data.segments)

    lines.enter()
      .append("svg:line")
      .attr("x1", function(seg){return seg.x1})
      .attr("x2", function(seg){return seg.x2})
      .attr("y1", function(seg){return seg.y1})
      .attr("y2", function(seg){return seg.y2})
      .attr("class", "temp-segment")
    })


  //   .attr("id", function(d,i)
  //   {
  //     var pairs = d.temps.map(function(t, i)
  //       {
  //         // still need to handle missing data
  //         // represented as value 999.9
  //         return "" + xScale(i) + "," + yScale(t)
  //       })
  //     console.log(pairs)
  //     return pairs.join(" ")
  //   })

  // kbh.forEach(function(item, index)
  //   {
  //     console.log(item.year)
  //   })

}




var zip = function(x, y)
{
  return [x,y]
}