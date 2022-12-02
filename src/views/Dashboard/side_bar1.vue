<template>
  <div>

    <div id="controlChart2"></div>
  </div>


</template>
<script>
import * as d3 from 'd3';
export default {
  name: 'top10countries',
  components: {

  },
  data() {
    return {}
  },
  methods: {
    createSVG() {

      var margin = {top: 20, right: 20, bottom: 20, left: 24},
    width = 280 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#controlChart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("temp_1961_2021.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.year);
      d.close = +d.value;
      d.country = d.id;
  });

  var data2 = data.filter(function(d) { return d.country == 840 })
  // console.log(data2)

  // Scale the range of the data
  x.domain(d3.extent(data2, function(d) { return d.date; }));
  y.domain([d3.min(data2, function(d) { return d.close; }), d3.max(data2, function(d) { return d.close; })]);

  // Add the valueline path.
  // svg.data([data2])
  // .filter(function(d) { return d.country == '553' })
  svg.append("path")
      // .filter(function(d) { return d.country == '008' })
      // .data([data2])
      // .filter(function(d) { return d.country == '553' })
      // .filter(function (d) { return d.date > parseTime(1980) })
      .attr("class", "lion")
      .attr("d", valueline(data2));

  // Add the x Axis
  svg.append("g")
    .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5));

  // Add the y Axis
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(8));

  svg.append("text")
    .text("°C")
    .attr("transform", "translate(-22,0)");

})
    }
  }, mounted() {
    this.createSVG()
  }
}
</script>
<style>

body { font: 12px Arial;}

.lion { 
    stroke: steelblue;
    stroke-width: 2;
    fill: none;
}

.axis path,
.axis line {
    fill: none;
    stroke: grey;
    stroke-width: 1;
    shape-rendering: crispEdges;
}

</style>