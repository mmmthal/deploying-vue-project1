<template>
    <div>
  
      <div id="controlChart0"></div>
    </div>
  
  
  </template>
  <script>
  import * as d3 from 'd3';
  export default {
    name: 'text_',
    components: {
  
    },
    data() {
      return {}
    },
    methods: {
      createSVG() {
  
    var margin = {top: 20, right: 20, bottom: 20, left: 24},
      width = 75 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;
  // Get the data
  d3.csv("temp_1961_2021.csv").then(function(data) {
  
    // format the data
    data.forEach(function(d) {
        d.date = d.year;
        d.close = +d.value;
        d.country = d.id;
    });
  
    var data2 = data.filter(function(d) { return d.country == 840 });
    var data3 = data2.filter(function(d) { return d.date == 2021});


    var tem = function(d){return Math.round(d.close*100)/100 + '°C,      '};
    // const co2 = function(d){return d.close + 't'};

    var svg= d3.select("#controlChart0");


    svg.selectAll("svg")
    .data(data3)
    .enter().append('text')
    .attr("fill", "#fff")
    .text(tem)
    .style("font-size", "32px");

    d3.csv("co2_data.csv").then(function(data_) {
      data_.forEach(function(d) {
        d.date = d.year;
        d.close = +d.co2_value;
        d.country = d.id;
    });

    var data2_ = data_.filter(function(d) { return d.country == 840 });
    var data3_ = data2_.filter(function(d) { return d.date == 2021});


    var co2 = function(d){return Math.round(d.close*100)/100 + 't'};

    svg.selectAll("svg")
    .data(data3_)
    .enter().append('text')
    .attr("fill", "#fff")
    .text(co2)
    .style("font-size", "32px");

    svg.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);


    })
  
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