// Data structure for line graph visualization
function Visualization() {
  this.height = 400
  this.width = 800
  this.margin = {"left": 30, "right": 30, "top": 30, "bottom": 30}
  this.origin = {"x": 0, "y": 0}
  this.xScale;
  this.yScale;
  this.data;
}


// Run the main function after the index page loads
d3.select(window).on('load', main("kbh.csv"));


// This is the main routine
function main(filename)
{
  // inspiration from: http://bl.ocks.org/enjalot/1525346
  d3.csv(filename, function(data)
  {
    var kbh = new Visualization()
    initVis(kbh)
    kbh.data = preprocessData(data, kbh)
    // console.log("KBH", kbh)
    addTempLines(kbh)
    addMeanDeviations(kbh)
  })
}

function preprocessData(data, dset)
{
  return data.map(function(d)
  {
    // d is a single year in the temperature dataset
    var y = d.YEAR
    var t = [d.JAN, d.FEB, d.MAR, d.APR, d.MAY, d.JUN,
             d.JUL, d.AUG, d.SEP, d.OCT, d.NOV, d.DEC]
    var s = mkSegments(dset, t)
    return {"year": y, "temps": t, "segments": s};
  })
}


function mkSegments(dset, tempArr)
{
  var i = 0
  var j = 1
  var segments = []
  while (j <= tempArr.length - 1) {
    if (tempArr[i] != 999.9 && tempArr[j] != 999.9)
    {
       s = {"x1": dset.xScale(i),
            "y1": dset.yScale(tempArr[i]),
            "x2": dset.xScale(j),
            "y2": dset.yScale(tempArr[j])
            }
      segments.push(s)
    }
    i += 1;
    j += 1;
  }
  return segments
}


function initVis(dset)
{
  // Insipration for using scales - https://bl.ocks.org/mbostock/3371592
  dset.xScale = d3.scaleLinear()
    .domain([-1,12])   // this is the value on the axis
    // this is the space allocated the axis
    .range([0, dset.width - dset.margin.left - dset.margin.left])
    .nice();

  dset.yScale = d3.scaleLinear()
    .domain([-10, 30])   // this is the value on the axis
    // this is the space allocated the axis
    .range([dset.height - dset.margin.top - dset.margin.bottom, 0])
    .nice();

  var xAxis = d3.axisBottom(dset.xScale)
    .ticks(12)

  var yAxis = d3.axisLeft(dset.yScale)
    .ticks(20)

  // add the main svg container
  var svg = d3.select("body")
    .append("svg")
    .attr("width", dset.width)
    .attr("height", dset.height)

  // add a group to organize yearly temperatures that will be drawn later
  svg.append("svg:g")
    .attr("id", "yearlyTemperatures")

  // add a group to organize the mean deviations that will be drawn later
  svg.append("svg:g")
    .attr("id", "meanDeviations")

  // add a group to organize x and y axis
  svg.append("svg:g")
    .attr("id", "xAxis")
    .attr("class", "axis")
    .attr("transform", "translate(30,"+ (dset.height - dset.margin.bottom) +")")
    .call(xAxis)

  svg.append("svg:g")
    .attr("id", "yAxis")
    .attr("class", "axis")
    .attr("transform", "translate(30,30)")
    .call(yAxis)
    .selectAll("line")
    .attr("class", "yGridlines")
    .attr("x2", dset.width - dset.margin.left - dset.margin.left)

  d3.selectAll("#yGridlines")
    .attr("stroke", null)
}


var addMeanDeviations = function(kbh)
{
  var vis = d3.select('#meanDeviations')

  var groups = vis.selectAll("g")
    .data(kbh.data)
}


var addTempLines = function(kbh)
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