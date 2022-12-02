<template>
  <div class="card p-3 mb-3">
    <svg id="proportion_chart" width="700" height="450"></svg>
  </div>
</template>
<script>
import * as d3 from 'd3';
import * as topojson from "topojson";
export default {
  name: 'proportion_chart',
  components: {
    
  },
  data() {
    return {}
  },
  methods: {
    createSVG() {
      var svg = d3.select("#proportion_chart"),
        width1 = +svg.attr("width"),
        height1 = +svg.attr("height");

      // Map and projection
      var projection = d3.geoMercator()
        .center([0, 20])                // GPS of location to zoom on
        .scale(99)                       // This is like the zoom
        .translate([width1 / 2, height1 / 2])

      var promises = [];
      promises.push(d3.json("worldmap.topojson"))
      promises.push(d3.csv("map1.csv"))

      Promise.all(promises).then(function (values) {  //use Promise.all to load map and data
        var dataGeo = values[0];
        var data = values[1];

        var json = topojson.feature(dataGeo, dataGeo.objects.countries);
        var path = d3.geoPath()
          .projection(projection);


        var format = d3.format(',.0f')
        // Create a color scale
        var allContinent = d3.map(data, function (d) { return (d.homecontinent) }).keys()
        var color = d3.scaleOrdinal()
          .domain(allContinent)
          .range(d3.schemePaired);

        // Add a scale for bubble size
        var valueExtent = d3.extent(data, function (d) { return +d.n; })
        // radius = d3.scaleSqrt([0, d3.quantile([...data.values()].sort(d3.ascending), 0.985)], [0, 15]);

        var radius = d3.scaleSqrt()
          .domain(valueExtent)  // What's in the data
          .range([1, 30])  // Size in pixel

        //draw the map
        svg.append('g')
          .attr('class', 'cities')
          .selectAll("path")
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style("stroke", 0.6)
          .style("opacity", .8);

        //add the legend
        const legend = svg.append('g')
          .attr('fill', '#777')
          .attr('transform', 'translate(90,430)')
          .attr('text-anchor', 'middle')
          .style('font', '10px sans-serif')
          .selectAll('g')
          // .data([10, 50, 70])
          .data([1e6, 5e6, 1e7])
          .join('g');


        legend.append('circle')
          .attr('fill', 'none')
          .attr('stroke', '#ccc')
          .attr('cy', d => -1 * radius(d))
          .attr('r', radius);

        legend.append('text')
          .attr('y', d => -2 * radius(d))
          .attr('dy', '1.3em')
          .text(d3.format('.1s'));

        // create and append the red/brown circles for the proportional symbol map. 
        svg
          .selectAll("myCircles")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function (d) { return projection([+d.homelon, +d.homelat])[0] })
          .attr("cy", function (d) { return projection([+d.homelon, +d.homelat])[1] })
          .attr("r", function (d) { return radius(+d.n) })
          .style("fill", function (d) { return color(d.homecontinent) })
          .attr("stroke", function (d) { if (d.n > 2000) { return "black" } else { return "none" } })
          .attr("stroke-width", 1)
          .attr("fill-opacity", .4)

        // Add title and explanation

        svg
          .append("text")
          .attr("text-anchor", "end")
          .style("fill", "black")
          .attr("x", 630 / 2 + 180)
          .attr("y", 350 / 8)
          .attr("width", 90)
          .style("font-size", 20)
          .text("Total number of Covid case in 10 Countries")

      })


    }
  },
   mounted() {
    this.createSVG()
  }

}
</script>
<style>

</style>
