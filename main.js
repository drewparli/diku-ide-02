// Data structure for line graph visualization
function Visualization() {
  this.origin = {"x": 0, "y": 0}
  this.height = 1400
  this.width = 800
  this.margin = new Margin(30, 30, 30, 30)
  this.scale = new Scale()
  this.xScale;
  this.yScale;
  this.colorScale;
  this.data;
  this.box = {"height": 10, "width": 64}
}

function Scale() {
  this.x = 0
  this.y = 1
}

function Margin(l, r, t, b) {
  this.left = l
  this.right = r
  this.top = t
  this.bottom = b
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
    console.log("KBH", kbh)
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
    .domain([0,11])   // this is the value on the axis
    // this is the space allocated the axis
    .range([0, dset.width - dset.margin.left - dset.margin.left])
    .nice()

  dset.yScale = d3.scaleLinear()
    .domain([-10, 26])   // this is the value on the axis
    // this is the space allocated the axis
    .range([400 - dset.margin.top - dset.margin.bottom, 0])
    .nice()

  dset.colorScale = d3.scaleLinear()
    .domain([24, -8])   // this is the value on the axis
    // this is the space allocated the axis
    .range([0, 1])

  var xAxis = d3.axisBottom(dset.xScale)
    .ticks(12)

  var yAxis = d3.axisLeft(dset.yScale)
    .ticks(16)

  d3.select("body")
    .append("div")
    .attr("class", "title")
    .text("Monthly Temperature Data, Copenhagen Denmark (1880-now)")

  d3.select("body")
    .append("svg")
    .attr("id", "tempGraph")
    .attr("width", 800)
    .attr("height", 400)

  d3.select("body")
    .append("svg")
    .attr("id", "meanDeviation")
    .attr("transform", "translate(0,50)")
    .attr("width", 900)
    .attr("height", 1800)

  d3.select("body")
    .append("svg")
    .attr("id", "footer")
    .attr("transform", "translate(0,50)")
    .attr("width", 800)
    .attr("height", 100)

  d3.select("#tempGraph")
    .append("svg:g")
    .attr("id", "xAxis")
    .attr("class", "axis")
    .attr("transform", "translate(30,"+ (400 - 30) +")")
    .call(xAxis)
    .selectAll("line")
    .attr("class", "xLines")
    .attr("y1", -340)
    .attr("y2", 6)
    .attr("stroke", null)

  d3.select("#tempGraph")
    .append("svg:g")
    .attr("id", "yAxis")
    .attr("class", "axis")
    .attr("transform", "translate(30,30)")
    .call(yAxis)
    .selectAll("line")
    .attr("class", "yLines")
    .attr("x1", -4)
    .attr("x2", 800 - 30 - 30)
    .attr("stroke", null)

  d3.select("#tempGraph")
    .select("#yAxis")
    .select(".domain").remove()

  d3.select("#tempGraph")
    .select("#xAxis")
    .select(".domain").remove()

  d3.select("#tempGraph")
    .append("svg:g")
    .attr("id", "lines")

  d3.select("#meanDeviation")
    .append("svg:g")
    .attr("id", "rows")
}


var addTempLines = function(kbh)
{
  var vis = d3.select("#tempGraph")
    .select("#lines")

  var groups = vis.selectAll("g")
    .data(kbh.data)

  groups.enter()
    .append("svg:g")
    .attr("class", "tempLine")
    .attr("transform", "translate("+kbh.margin.left+","+kbh.margin.top+")")
    .attr("id", function(d,i)
    {
        return "_" + d.year
    })

  // add line segments for each data point
  kbh.data.forEach(function(data, i)
    {
    var year = d3.select("#tempGraph")
      .select("#_" + data.year)

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


var addMeanDeviations = function(kbh)
{
  var vis = d3.select('#meanDeviation')
    .select("#rows")

  // add rows per year
  var groups = vis.selectAll("g")
    .data(kbh.data.reverse())

  groups.enter()
    .append("svg:g")
    .attr("class", "row")
    .attr("id", function(d,i)
      {
        return "_" + d.year
      })
    .attr("transform", function(d,i)
    {
      var x = 0
      var y = (i * kbh.box.height) + (i * 3)
      return "translate(" + x + "," + y + ")"
    })

  // add cells per month
  kbh.data.forEach(function(data, i)
    {
    var year = d3.select("#meanDeviation")
      .select("#rows")
      .select("#_" + data.year)

    var cells = year.selectAll("rect")
      .data(data.temps)

    cells.enter()
      .append("svg:rect")
      .attr("id", function(d,i)
      {
        return "_" + i
      })
      .attr("class", "tempCell")
      .attr("width", kbh.box.width)
      .attr("height", kbh.box.height)
      .attr("style", function(d)
      {
        if (d != 999.9) {
          var c = d3.interpolateRdBu(kbh.colorScale(d))
          // var c = d3.interpolateRdYlBu(kbh.colorScale(d))
          return "fill:" + c + ";"
        } else {
          return "fill:rgb(175,175,175);"
        }
      })
      .attr("transform", function(d,i)
      {
        var x = kbh.xScale(i) + 30 - 32
        var y = 0
        return "translate(" + x + "," + y + ")"
      })

    year.append("svg:text")
      .attr("id", data.year)
      .attr("class", "gridYear")
      .text(data.year)
      .attr("transform", function(d,i)
      {
        var x = kbh.xScale(12) + 30 - 32 + 14
        var y = 10
        return "translate(" + x + "," + y + ")"
      })
    })
}