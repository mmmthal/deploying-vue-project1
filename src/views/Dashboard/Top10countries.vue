<template>
  <div>
    <!-- <div class="text-center mb-2" role="group" aria-label="Basic mixed styles example"> Filter
      <button type="button" class="btn btn-danger" id="all">All</button>
      <button type="button" class="btn btn-warning" id="top">Top 5 by value</button>
      <button type="button" class="btn btn-success" id="bottom">Bottom 5 by value</button>
    </div>


    <div class="text-center mb-2" role="group" aria-label="Basic outlined example"> Order by
      <button type="button" class="btn btn-outline-primary" id="name">name</button>
      <button type="button" class="btn btn-outline-primary" id="ascendingValue">ascending by value</button>
      <button type="button" class="btn btn-outline-primary" id="descendingValue">descending by value</button>
    </div>
    <div class=" text-center mb-1">
      <button type="button" class="btn btn-danger" id="reset">Reset</button>
    </div> -->

    <div id="controlChart21"></div>
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
    width = 850 - margin.left - margin.right,
    height = 510 - margin.top - margin.bottom;

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
var svg = d3.select("#controlChart21").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("world_temp.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.year);
      d.close = +d.value;
      // d.country = d.id;
  });
  var data2 = data;
  // var data2 = data.filter(function(d) { return d.country == 8 })
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

// });
// function name(params) {
  
// }

// function(Te){Object.filter = (obj, predicate) => 
//     Object.keys(obj)
//           .filter( key => predicate(obj[key]) )
//           .reduce( (res, key) => (res[key] = obj[key], res), {} );

// var margin = {top: 20, right: 20, bottom: 20, left: 20},
//     width = 280 - margin.left - margin.right,
//     height = 150 - margin.top - margin.bottom;

// var svg = d3.select("#controlChart2").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("temp_1961_2021.csv",

//   // When reading the csv, I must format variables:
//   function(d){
//     return { date : d3.timeParse("%Y")(d.year), value : d.value, country : d.id }
//   },

//   // Now I can use this dataset:
//   function(data) {

//     // Add X axis --> it is a date format
//     Object.filter = (obj, predicate) => 
//     Object.keys(obj)
//           .filter( key => predicate(obj[key]) )
//           .reduce( (res, key) => (res[key] = obj[key], res), {} );

//     var data2 = Object.filter(data, country => country == 8);

//     console.log(data2)

//     var x = d3.scaleTime()
//       .domain(d3.extent(data2, function(d) { return d.date; }))
//       .range([ 0, width ]);

//     svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//     // Add Y axis
//     var y = d3.scaleLinear()
//       .domain([0, d3.max(data2, function(d) { return +d.value; })])
//       .range([ height, 0 ]);
//     svg.append("g")
//       .call(d3.axisLeft(y));

//     // Add the line
//     svg.append("path")
//       .datum(data2)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", d3.line()
//         .x(function(d) { return x(d.date) })
//         .y(function(d) { return y(+d.value) })
//         )

})

var div = d3.select("body").append("div")
     .attr("class", "tooltip-donut")
     .style("opacity", 0);

d3.csv("co2_world.csv").then(function(data) {
  data.forEach(function(d) {
  d.date = parseTime(d.year);
  d.close = +d.value;});

  var height1 = 470
  svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d) =>x(d.date)  )
  // .attr('y',  (d) =>d.close)
  .attr('y',  (d) => height1 - (d.close - 3.069) * 100)
  .attr('width', 5)
  // .attr('width', x.bandwidth)
  .attr('height',  (d) => (d.close - 3.069) * 100)
  // .attr('height', 60)
  .style('fill', 'skyblue')
  .on('mouseover', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '.5');
          div.transition()
               .duration(50)
               .style("opacity", 1.5);
          let num = (Math.round((d.close - 3.069)*10000)/10000).toString() + " ton";
          // let num = (10).toString() + '%';
          div.html(num)
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 15) + "px");
     })
     .on('mouseout', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1');
          div.transition()
               .duration('50')
               .style("opacity", 0);
     });
})

svg.append("text")
  .attr('x', 400)             
  .attr('y', 10)
  .attr('text-anchor', 'middle')
  .style('font-size', '16px')
  .style('color', '#fff')
  .text('Bar chart of World CO2 per capita increase from 1961-2021');

svg.append("text")
  .attr('x', 400)             
  .attr('y', 30)
  .attr('text-anchor', 'middle')
  .style('font-size', '16px')
  .style('color', '#fff')
  .text('Line chart of World temperature increase from 1961-2021');

svg.append("text")
  .attr('x', 765)             
  .attr('y', 490)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('color', '#fff')
  .text('Year');

  svg.append("text")
  .attr('x', 20)             
  .attr('y', -1)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('color', '#fff')
  .text('Temp in °C');

  
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
div.tooltip-donut {
     position: absolute;
     text-align: center;
     padding: .5rem;
     background: #FFFFFF;
     color: #313639;
     border: 1px solid #313639;
     border-radius: 8px;
     pointer-events: none;
     font-size: 1.3rem;
}
.axis path,
.axis line {
    fill: none;
    stroke: grey;
    stroke-width: 1;
    shape-rendering: crispEdges;
}

</style>