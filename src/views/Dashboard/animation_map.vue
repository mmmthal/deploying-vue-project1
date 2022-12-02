<template>
    <!-- <div class="card p-3 mb-3">
        <svg id="animation_map" width="700" height="450"></svg>
    </div> -->
<div >
    <div id="zoom-buttons">
        <button id="zoom-in">+</button>
        <button id="zoom-out">-</button>
    </div>
    <div id="vis">
        <button id="play-button">Play</button>
        <button id="Temperature">Do not show temp</button>
        <button id="co2">Do not show CO2</button>
    </div>
    <div id = "side-bar"></div>
    <!-- <div id = 'test'>
    </div> -->
</div>

</template>
<script>

import * as d3 from 'd3';
import { geoCylindricalStereographic} from 'd3-geo-projection';
import * as topojson from "topojson";

export default {
  name: 'animation_map',
  components: {

  },
  props: [],
  data() {
    return {
      size: [510, 950],
      // size: [110, 200],
    }
  },
  methods: {
    resize(){
      var margin = { top: 50, right: 50, bottom: 0, left: 50 },
        width = this.size[1] - margin.left - margin.right;    //changed1 Qian

      var svg = d3.select("#maim_map")
        .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom); 

      var svg1 = d3.select("#slider")          //changed3 Qian
        .attr("width", width + margin.left + margin.right);
        // .attr("height", 100);
    },
    createSVG() {
      var temp = true;
      var co2_tf = true;
      var formatDateIntoYear = d3.timeFormat("%Y");
      var parseDate = d3.timeParse("%m/%d/%y");

      var startDate = new Date("1961-11-01"),
        endDate = new Date("2021-04-01");

      var margin = { top: 50, right: 50, bottom: 0, left: 50 },
        width = 950 - margin.left - margin.right,     //changed1 Qian
        height = 510 - margin.top - margin.bottom;     //changed2 Qian

      var svg = d3.select("#vis")
        .append("svg")
        .attr("id", "maim_map")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var svg1 = d3.select("#vis")          //changed3 Qian
                   .append("svg")
                   .attr("id", "slider")
                   .attr("width", width + margin.left + margin.right)
                   .attr("height", 100);
                  //  .attr("transform", translate(50,0))

      var svg2 = d3.select("#side-bar")
                   .append("p")
                   .attr('transform', "translate(1000, 50)")
      
      const projection = geoCylindricalStereographic().scale(130);

      var path = d3.geoPath(projection);

      const zoom = d3.zoom()
        .scaleExtent([0.5, 10])
        .on('zoom', zoomed);

      svg.call(zoom);
      // d3.select("#circles").call(zoom);

      ////////// slider //////////

      var moving = false;
      var currentValue = 0;
      var targetValue = width;

      var playButton = d3.select("#play-button");
      var Temperature = d3.select("#Temperature");
      var co2 = d3.select("#co2");
      var timer;

      var x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);

      var slider = svg1.append("g")     //changed4 Qian
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + 50 + ")");  //changed5 Qian

      slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
          .on("start.interrupt", function () { slider.interrupt(); })
          .on("start drag", function () {
          //   currentValue = d3.event.x;
            currentValue = d3.event.x;
            // console.log(currentValue);
            update(x.invert(currentValue));
          })
        );

      slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function (d) { return formatDateIntoYear(d); });

      var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

      var label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDateIntoYear(startDate))
        .attr("transform", "translate(0," + (-25) + ")")


      ////////// map //////////

      var us;
      var temp_data;
      var co2_data;
      var co2_data1;

      var promises = [];
      promises.push(d3.json('countries-110m.json'));
      promises.push(d3.csv('temp_1961_2021.csv'));
      promises.push(d3.csv('co2_data.csv'));
      // console.log(zoom.translate());

      Promise.all(promises).then(function (values) {  //see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
          us = values[0];
          temp_data = values[1];
          co2_data = values[2];
          update(startDate);
         
          // drawPlot(us, temp_data);
      });   
      
      // var valueExtent = d3.extent(co2_data, function (d) { return +d.co2_value});
      //   // radius = d3.scaleSqrt([0, d3.quantile([...data.values()].sort(d3.ascending), 0.985)], [0, 15]);

      // var radius = d3.scaleSqrt()
      //   .domain(valueExtent)  // What's in the data
      //   .range([1, 30]);  // Size in pixel

      playButton
        .on("click", function () {
          var button = d3.select("#play-button");
          
          
            if (button.text() == "Pause") {
              moving = false;
              clearInterval(timer);
              button.text("Play");
            } 
            else {
              moving = true;
              timer = setInterval(step, 50);
              button.text("Pause");
            }
            // console.log("Slider moving: " + moving);
        });


      var button_temp =  d3.select("#Temperature");
      var button_temp_co2 =  d3.select("#co2");
      var original_color = [];
      var original_co2 = [];
      var original_year;
      var original_year_co2;
//       document.getElementById('smallcircle').addEventListener('hover', function(e) {
//     e.currentTarget.setAttribute('fill', '#ff00cc');
// });

      Temperature
      .on("click", function () {
        // var button = d3.select("#Temperature");
        if (button_temp.text() == "Do not show temp") {
          hide_temp();
          } 
        else {
          show_temp();  
    }});

    co2
      .on("click", function () {
        if (button_temp_co2.text() == "Do not show CO2") {
          hide_co2();
          } 
        else {
          show_co2();  
    }});

      function hide_temp(){
        var divsToHide = document.getElementsByClassName("color");  //divsToHide is an array
        for(var i = 0; i < divsToHide.length; i++){
          original_color.push(divsToHide[i].getAttribute("fill"));
            divsToHide[i].setAttribute("fill","gray");
            
        }
        // console.log(original_color);
        original_year = currentValue;
        button_temp.text("Show temp");
        temp = false;
      }

      // function show_temp(){
      //   temp = true;
      //   update(x.invert(currentValue));
      //   // console.log(x.invert(currentValue));
      //   button_temp.text("Showing Temperature");
      // }

      function show_temp(){
        temp = true;
        button_temp.text("Do not show temp");
        if (currentValue == original_year){
        var divsToHide = document.getElementsByClassName("color");  //divsToHide is an array
        for(var i = 0; i < divsToHide.length; i++){
          // original_color.push(divsToHide[i].getAttribute("fill"));
            divsToHide[i].setAttribute("fill",original_color[i]);

        }}
        else{
             update(x.invert(currentValue));
        }
       
      }

      function hide_co2(){
        var divsToHide = document.getElementsByClassName("co2_class");  //divsToHide is an array
        for(var i = 0; i < divsToHide.length; i++){
          original_co2.push(divsToHide[i].getAttribute("fill-opacity"));
            divsToHide[i].setAttribute("fill-opacity",0);
        }
        original_year_co2 = currentValue;
        button_temp_co2.text("Show CO2");
        co2_tf = false;
      }

      function show_co2(){
        co2_tf = true;
        
        // console.log(x.invert(currentValue));
        button_temp_co2.text("Do not show CO2");
        if (currentValue == original_year_co2){
        var divsToHide = document.getElementsByClassName("co2_class");  //divsToHide is an array
        for(var i = 0; i < divsToHide.length; i++){
          // original_color.push(divsToHide[i].getAttribute("fill"));
            divsToHide[i].setAttribute("fill-opacity",original_co2[i]);

        }}
        else{
             update(x.invert(currentValue));
        }
      }

      function step() {
        update(x.invert(currentValue));
        currentValue = currentValue + (targetValue / 151);
        if (currentValue > targetValue) {
          moving = false;
          currentValue = 0;
          clearInterval(timer);
          // timer = 0;
          playButton.text("Play");
          // console.log("Slider moving: " + moving);
        }
      }

      function drawPlot(us, data) {
        var states = new Map(us.objects.land.geometries.map(d => [d.id, d.properties]));

        var format = d => `${d}%`
        // d3.schemeSpectral[11]
        // 
        var color = d3.scaleQuantize([-2, 1.0], ['#df2935', '#e43d2d', '#e95124', '#ee661c', '#f37a14', '#f9900b', '#fea402', '#f2ae04', '#dfb20a', '#cbb811', '#b9bd17', '#a6c11d', '#94c623', '#80c334', '#6fb84c', '#5dad65', '#4ba17e', '#389599', '#268ab2', '#1c80c2', '#2977ba', '#376eb2', '#4465aa', '#515da2', '#5d549b', '#6a4c93'])  // Create a Quantize color scale based on d3.schemeBlues (9 shades of Blue) 

        var mapped_data = data.map(d => [d.id, [+d.value, d.year]]);

        data = Object.assign(new Map(mapped_data));

        data.title = "Wind Electricity Generation";

        d3.select("#subplot").remove();
        d3.select("#circles").remove();
        d3.select("#subplot-mesh").remove();
            
        svg.append("g")
            .attr("id", "subplot")
            .attr("class","countries")
            // .attr("transform", "translate(-80,0)")    //changedn Qian
            .selectAll("path")
            .data(topojson.feature(us, us.objects.countries).features)
            // .attr("transform", "translate(-80,0)")
            .join("path")
            .attr("fill", d => {
                if(data.has(d.id) && temp){
                    return color(-data.get(d.id)[0]);
                }
                else{
                    // console.log(d.id)
                    // return color(0);
                    return "gray";
                }
            })
            .attr("d", path)
            .attr("class", "color")
            .append("title");
            // .attr("weight", 500)
            // .attr("height", 800);
        
          svg
          .append("g")
          .attr("id", "circles")
          .attr("class","circles1")
          .selectAll("myCircles")
          .data(co2_data1)
          .enter()
          .append("circle")
          .attr("cx", function (d) { return projection([+d.long, +d.lat])[0] })
          .attr("cy", function (d) { return projection([+d.long, +d.lat])[1] })
          .attr("r", function (d) { return (+d.co2_value) * 3 })
          .attr("id","smallcircle")
          // .attr("onmouseover",setAttribute('brightness', 1.8))
          // .attr("onmouseout",this.setAttribute('brightness', 0.5))
          // .attr("r", 3 )
          .style("fill", "black")
          // .attr("stroke", function (d) { if (d.co2_value > 5) { return "black" } else { return "none" } })
          // .attr("stroke-width", 1)
          .attr("fill-opacity", d => {
            if (co2_tf){
              return 0.6;
            }
            else{
              return 0;
            }
          })
          .attr("class","co2_class");

        svg.append("path")
            .attr("id", "subplot-mesh")
            .datum(topojson.mesh(us, us.objects.countries, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.8)
            .attr("stroke-linejoin", "round")
            .attr("d", path);
        }

      function update(h) {
        handle.attr("cx", x(h));
        label
          .attr("x", x(h))
          .text(formatDateIntoYear(h));
        h = formatDateIntoYear(h)
        // console.log(h);
        var newData = temp_data.filter(d => d.year == h)
        co2_data1 = co2_data.filter(d => d.year == h)
        drawPlot(us, newData);
      }

      function zoomed() {
        var zoomScale = d3.event.transform.k

        d3.zoomIdentity
          .scale(zoomScale)

        svg
          .selectAll('path')
          // .select("#maim_map")
          .attr('transform', d3.event.transform);
        
        svg.selectAll('circle')
          // .select("#maim_map")
          .attr('transform', d3.event.transform);

        
        // console.log(zoom.scale(), zoom.translate());
      }

      d3.select('#zoom-in').on('click', function () {
        // console.log('zoomin in')
        zoom.scaleBy(svg.transition().duration(500), 1.3);
      });

      d3.select('#zoom-out').on('click', function () {
        zoom.scaleBy(svg.transition().duration(500), 1 / 1.3);
      });
    },

    resize_map() {
      var map_container = document.getElementById("map_container");
      this.size = [map_container.offsetHeight, map_container.offsetWidth ];
      // console.log(this.size);
    }
  },
  mounted() {
    window.addEventListener("resize", this.resize_map, true);
    this.createSVG();

    this.$watch(
      'size',
      () => {
        this.resize();
      },
      { immediate: true }
    );
  }

}
</script>

<style>
  body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8px;
      color: #696969;
    }

    #play-button {
      position: absolute;
      bottom: 140px;
      left: 50px;
      background: #333;
      padding-right: 26px;
      border-radius: 3px;
      border: none;
      color: white;
      margin: 0;
      padding: 0 12px;
      width: 70px;
      cursor: pointer;
      height: 30px;

    }

  .countries :hover {
    filter: brightness(130%);
  }

 

    #play-button:hover {
      background-color: #696969;
    }

    #Temperature {
    position: absolute;
    bottom: 350px;
    left: 30px;
    background: #333;
    padding-right: 26px;
    border-radius: 3px;
    border: none;
    color: white;
    margin: 0;
    padding: 0 12px;
    width: 160px;
    cursor: pointer;
    height: 30px;
    opacity: 0.8;

  }

  #co2 {
    position: absolute;
    bottom: 300px;
    left: 30px;
    background: #333;
    padding-right: 26px;
    border-radius: 3px;
    border: none;
    color: white;
    margin: 0;
    padding: 0 12px;
    width: 160px;
    cursor: pointer;
    height: 30px;
    opacity: 0.8;
    /* opacity: 0.8; */

  }

  #Temperature:hover {
    background-color: #696969;
  }

  #co2:hover {
    background-color: #696969;
  }
    .ticks {
      font-size: 10px;
    }

    .track,
    .track-inset,
    .track-overlay {
      stroke-linecap: round;
    }

    .track {
      stroke: #000;
      stroke-opacity: 0.3;
      stroke-width: 10px;
    }

    .track-inset {
      stroke: #dcdcdc;
      stroke-width: 8px;
    }

    .track-overlay {
      pointer-events: stroke;
      stroke-width: 50px;
      stroke: transparent;
      cursor: crosshair;
    }

    .handle {
      fill: #fff;
      stroke: #000;
      stroke-opacity: 0.5;
      stroke-width: 1.25px;
    }

    #zoom-buttons {
      position: absolute;
      margin-left: 10px;
      margin-top: 10px;
      padding: 5px;
      background: #fff;
    }

    #zoom-buttons button {
      background: #efefef;
      color: #231F20;
      border: 0;
      padding: 0;
      border-radius: 2px;
      width: 25px;
      height: 25px;
    }
</style>
