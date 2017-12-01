// Data structure for line graph visualization
function LineGraph() {
  this.height = 400
  this.width = 800
  this.margin = {"left": 30, "right": 30, "top": 30, "bottom": 30}
  this.origin = {"x": 0, "y": 0}
  this.xScale;
  this.yScale;
  this.data;
}

// Global Variables

// Run the main function after the index page loads
d3.select(window).on('load', main("kbh.csv"));


// This is the main routine
function main(filename)
{
  // inspiration from: http://bl.ocks.org/enjalot/1525346
  d3.csv(filename, function(data)
  {
    var kbh = new LineGraph()
    initTempGraph(kbh)

    // assignment to global variable to make data available
    kbh.data = data.map(function(d)
    {
      // d is a single year in the kbh dataset
      var y = d.YEAR
      var t = [d.JAN, d.FEB, d.MAR, d.APR, d.MAY, d.JUN,
               d.JUL, d.AUG, d.SEP, d.OCT, d.NOV, d.DEC]
      var s = mkSegments(kbh, t)
      return {"year": y, "temps": t, "segments": s};
    })
    addTempLines(kbh, kbh.data)
  })
}


function initTempGraph(kbh)
{
  // Insipration for using scales - https://bl.ocks.org/mbostock/3371592
  kbh.xScale = d3.scaleLinear()
    .domain([0,11])   // this is the value on the axis
    // this is the space allocated the axis
    .range([0, kbh.width - kbh.margin.left - kbh.margin.left])
    .nice();

  kbh.yScale = d3.scaleLinear()
    .domain([-10, 30])   // this is the value on the axis
    // this is the space allocated the axis
    .range([kbh.height - kbh.margin.top - kbh.margin.bottom, 0])
    .nice();

  var xAxis = d3.axisBottom(kbh.xScale)
    .ticks(10)

  var yAxis = d3.axisLeft(kbh.yScale)
    .ticks(10)

  // add the main svg container
  var svg = d3.select("body")
    .append("svg")
    .attr("width", kbh.width)
    .attr("height", kbh.height)

  // add a group to organize x and y axis
  svg.append("svg:g")
    .attr("id", "xAxis")
    .attr("class", "axis")
    .attr("transform", "translate(30,370)")
    .call(xAxis)

  svg.append("svg:g")
    .attr("id", "yAxis")
    .attr("class", "axis")
    .attr("transform", "translate(30,30)")
    .call(yAxis)

  svg.append("svg:g")
    .attr("id", "yearlyTemperatures")

  d3.select("#xAxis")
    .append("svg:line")
    .attr("class", "xGrid")
    .attr("transform", "translate(30,370)")
    .attr("x1", 0)
    .attr("y1", kbh.yScale(15))
    .attr("x2", kbh.xScale(11))
    .attr("y2", kbh.yScale(15))
}


var addTempLines = function(kbh, dataset)
{
  var vis = d3.select('#yearlyTemperatures')

  var groups = vis.selectAll("g")
    .data(kbh.data)

  groups.enter()
    .append("svg:g")
    .attr("class", "temp-line")
    .attr("transform", "translate("+kbh.margin.left+","+kbh.margin.top+")")
    .attr("id", function(d,i)
    {
        return "_" + d.year
    })

  // add line segments for each data point
  kbh.data.forEach(function(data, i)
    {
    var year = d3.select("#_" + data.year)

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
}

function mkSegments(kbh, tempArr)
{
  var i = 0
  var j = 1
  var segments = []

  while (j <= tempArr.length - 1) {
    if (tempArr[i] != 999.9 && tempArr[j] != 999.9)
    {
      console.log("made it")
      s = {
        "x1": kbh.xScale(i),
        "y1": kbh.yScale(tempArr[i]),
        "x2": kbh.xScale(j),
        "y2": kbh.yScale(tempArr[j]),
      }
      segments.push(s)
    }
    i += 1;
    j += 1;
  }

  return segments
}



var zip = function(x, y)
{
  return [x,y]
}