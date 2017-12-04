/* This is the main data structure for the whole visualization. */
function Visualization() {
  this.height = 1400
  this.width = 800
  this.margin = new Margin(30, 30, 30, 30)
  this.scale = new Scale()
  this.data
  this.gdata = new GData()
  this.heatmap = new HeatMap()
  this.box = {"height": 4, "width": (this.width / 12) - 2}
}

function GData() {
  this.max = [-100,
              -101,
              -102,
              -103,
              -104,
              -105,
              -106,
              -107,
              -108,
              -109,
              -110,
              -111]

  this.min = {0:100,
              1:100,
              2:100,
              3:100,
              4:100,
              5:100,
              6:100,
              7:100,
              8:100,
              9:100,
              10:100,
              11:100}
}

/* These are other data structures used to organize constants and magic numbers */
function HeatMap() {
  this.origin = new Origin(0, 10)
}

function Origin(x, y) {
  this.x = x
  this.y = y
}

function Scale() {
  this.x
  this.y
  this.heatmap
}

function Margin(l, r, t, b) {
  this.left = l
  this.right = r
  this.top = t
  this.bottom = b
}



/* Run the main function after the index page loads */
d3.select(window).on('load', main("kbh.csv"));


/* This is the main routine */
function main(filename)
{
  d3.csv(filename, function(data)
  {
    var vis = new Visualization()
    initVis(vis)
    preprocessData(vis, data)
    console.log("VIS", vis)
    addTempLines(vis)
    addMeanDeviations(vis)
  })
}


function preprocessData(vis, data)
{
  /* d is a single year in the temperature dataset */
  vis.data = data.map(function(d)
  {
    var y = d.YEAR
    var t = [d.JAN, d.FEB, d.MAR, d.APR, d.MAY, d.JUN,
             d.JUL, d.AUG, d.SEP, d.OCT, d.NOV, d.DEC].map(Number)
    // TODO: add mean temp for whole range of years by month
    // TODO: find standard deviation from this mean for each data point

    var sum = 0
    var min = 100
    var max = -100
    for (var i = 0; i <= t.length - 1; i++) {
      if (t[i] != 999.9)
        {
          // console.log(i, t[i], vis.gdata.max[i], vis.gdata.min[i])
          sum += t[i];
          if (t[i] > max) {max = t[i]}
          if (t[i] < min) {min = t[i]}
          if (t[i] > vis.gdata.max[i]) {vis.gdata.max[i] = t[i]}
          if (t[i] < vis.gdata.min[i]) {vis.gdata.min[i] = t[i]}
        } else {continue;
          // TODO: use the average of the past few years here instead
        }
    }
    var m = sum / t.length
    var s = mkSegments(vis, t)
    return {
            "mean": m,
            "min": min,
            "max": max,
            "segments": s,
            "temps": t,
            "year": y,
            };
  })
}


function mkSegments(vis, tempArr)
{
  var i = 0
  var j = 1
  var segments = []
  while (j <= tempArr.length - 1) {
    if (tempArr[i] != 999.9 && tempArr[j] != 999.9)
    {
       s = {"x1": vis.scale.x(i),
            "y1": vis.scale.y(tempArr[i]),
            "x2": vis.scale.x(j),
            "y2": vis.scale.y(tempArr[j])
            }
      segments.push(s)
    }
    i += 1;
    j += 1;
  }
  return segments
}


function initVis(vis)
{
  // Insipration for using scales - https://bl.ocks.org/mbostock/3371592
  vis.scale.x = d3.scaleLinear()
    .domain([0,11])   // this is the value on the axis
    // this is the space allocated the axis
    .range([0, vis.width - vis.margin.left - vis.margin.left])
    .nice()

  vis.scale.y = d3.scaleLinear()
    .domain([-10, 26])   // this is the value on the axis
    // this is the space allocated the axis
    .range([400 - vis.margin.top - vis.margin.bottom, 0])
    .nice()

  vis.scale.heatmap = d3.scaleLinear()
    .domain([23, -7])   // this is the value on the axis
    // this is the space allocated the axis
    .range([0, 1])

  var xAxis = d3.axisBottom(vis.scale.x)
    .ticks(12)

  var yAxis = d3.axisLeft(vis.scale.y)
    .ticks(16)

  /* Adding the title */
  d3.select("body")
    .append("div")
    .append("h1")
    .attr("class", "title")
    .text("Monthly Temperature Data, Copenhagen Denmark (1880-now)")

  /* Adding the main containter for the temperature graph */
  d3.select("body")
    .append("svg")
    .attr("id", "tempGraph")
    .attr("width", 800)
    .attr("height", 400)

  /* Adding the main containter for the heat map */
  d3.select("body")
    .append("svg")
    .attr("id", "heatmap")
    .attr("transform", "translate(0," + vis.heatmap.origin.y + ")")
    .attr("width", 900)
    .attr("height", 1800)

  /* Adding some spacing at the bottom of the visualization */
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

  d3.select("#heatmap")
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
  var vis = d3.select('#heatmap')
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
      var y = (i * kbh.box.height) + (i * 1)
      return "translate(" + x + "," + y + ")"
    })

  // add cells per month
  kbh.data.forEach(function(data, i)
    {
    var year = d3.select("#heatmap")
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
          var temp = kbh.scale.heatmap(d)
          // var c = d3.interpolateRdYlBu(kbh.colorScale(d))
          return "fill:" + d3.interpolateRdBu(temp) + ";"
        } else {
          return "fill:rgb(175,175,175);"
        }
      })
      .attr("transform", function(d,i)
      {
        var x = kbh.scale.x(i) + 30 - 32
        var y = 0
        return "translate(" + x + "," + y + ")"
      })

    year.append("svg:text")
      .attr("id", data.year)
      .attr("class", "gridYear")
      .text(data.year)
      .attr("transform", function(d,i)
      {
        var x = kbh.scale.x(12) + 30 - 32 + 14
        var y = 10
        return "translate(" + x + "," + y + ")"
      })
    })
}