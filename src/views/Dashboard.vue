<template>
  <div>
     <b-container fluid  class="mt--7 ">
      <!-- Card stats -->
      <b-row  class="pb-4 pb-4 pt-10 pt-md-8 ">
        <b-col xl="3" md="6">
          <stats-card title="60 Year" type="gradient-red" sub-title="Temperature +1.30°C" class="mb-4">

            <template slot="footer">
              <span class="text-danger mr-2">0.021°C</span>
              <span class="text-nowrap">Per Year</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="60 Year" type="gradient-orange" sub-title="CO2 per capita +1.62t" class="mb-4">

            <template slot="footer">
              <span class="text-danger mr-2">52.91%</span>
              <span class="text-nowrap">Since 1961</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="30 Year" type="gradient-green" sub-title="Temperature +0.71°C" class="mb-4">

            <template slot="footer">
              <span class="text-danger mr-2">0.023°C</span>
              <span class="text-nowrap">Per Year</span>
            </template>
          </stats-card>

        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="30 Year" type="gradient-info" sub-title="CO2 per capita +0.39t" class="mb-4">

            <template slot="footer">
              <span class="text-danger mr-2">9.17%</span>
              <span class="text-nowrap">Since 1991</span>
            </template>
          </stats-card>
        </b-col>
      </b-row>
 
    <!--Charts-->
    <b-row>
      <b-col>
        <b-card class="my-custom-class border-0"
    title="Time Series World Temperature Changing Map" body-class="text-center" header-tag="nav"
  >
    <b-card-text>
      We compare each countries average annual temperatures to their standard temperatures and display these differences by color.
      The standatd temperature is the average annual temperature from 1950-1980. And we use circle to show top 10 CO2 per 
      capita emission countries.
    </b-card-text>
  </b-card>
      </b-col>
    </b-row>
    
    <b-row cols="2" >
        <b-col xl="9" class="mb-5 mb-xl-0">
          <b-card no-body>
            <b-tabs pills card>
              <b-tab title="Main map" active>
                <b-card-text type="default" id="map_container" header-classes="bg-transparent" >
                  <animation_map :height="510" ref="animation_map"></animation_map>
                </b-card-text>
              </b-tab>
              <b-tab title="Overall trend">
                <b-card-text>
                  <top10countries></top10countries>
                </b-card-text>
              </b-tab>
              <!-- <b-tab title="Tab 3">
                <b-card-text>
                  <proportion_chart></proportion_chart>
                </b-card-text>
              </b-tab> -->
            </b-tabs>
          </b-card>
        
        </b-col>

        <b-col xl="3" md="">
        <b-row>
        <card header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h5 class="h3 mb-0">US DATA</h5>
                <h6 class="text-uppercase text-muted ls-1 mb-1">Temperature,    CO2 Emission Per Capita</h6>
              </b-col>
            </b-row>
            <side_text :height="50"></side_text>
            </card>
          </b-row>
          <b-row>
          <card header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-uppercase text-muted ls-1 mb-1">Time Series LineChart of</h6>
                <h5 class="h3 mb-0">Change of Temperature</h5>
              </b-col>
            </b-row>
            <side_barchart1 :height="200"></side_barchart1>
          </card>
        </b-row>
        <b-row>
        <card header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-uppercase text-muted ls-1 mb-1">Time Series LineChart of</h6>
                <h5 class="h3 mb-0">CO2 Per Capita</h5>
              </b-col>
            </b-row>
            <side_barchart2 :height="400"></side_barchart2>
            </card>
          </b-row>
          </b-col>
        
     
      </b-row>
      <!-- <b-row class="pb-4 pb-4 pt-10 pt-md-5 ">
        <b-col xl="6"  class="mb-5 mb-xl-0">
          <card type="default" header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-light text-uppercase ls-1 mb-1">Overview</h6>
                <h5 class="h3 text-white mb-0">Sales value</h5>
              </b-col>
              <b-col>
                <b-nav class="nav-pills justify-content-end">
                  <b-nav-item class="mr-2 mr-md-0" :active="bigLineChart.activeIndex === 0" link-classes="py-2 px-3"
                    @click.prevent="initBigChart(0)">
                    <span class="d-none d-md-block">Month</span>
                    <span class="d-md-none">M</span>
                  </b-nav-item>
                  <b-nav-item link-classes="py-2 px-3" :active="bigLineChart.activeIndex === 1"
                    @click.prevent="initBigChart(1)">
                    <span class="d-none d-md-block">Week</span>
                    <span class="d-md-none">W</span>
                  </b-nav-item>
                </b-nav>
              </b-col>
            </b-row> :chart-data="bigLineChart.chartData"
              :extra-options="bigLineChart.extraOptions"
            <line-chart :height="350" ref="bigChart" :chart-data="bigLineChart.chartData"
              :extra-options="bigLineChart.extraOptions">
            </line-chart>
          </card>
        </b-col>

        <b-col xl="4" sm="10" class="mb-5 mb-xl-0">
          <card header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                <h5 class="h3 mb-0">Total orders</h5>
              </b-col>
            </b-row>

            <bar-chart :height="350" ref="barChart" :chart-data="redBarChart.chartData">
            </bar-chart>
          </card>
        </b-col>
      </b-row> -->
      <!-- End charts-->

      <!--Tables-->
 
    </b-container>

  </div>
</template>
<script>
import * as d3 from 'd3';

// Charts
import * as chartConfigs from '@/components/Charts/config';
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';

// Components
import BaseProgress from '@/components/BaseProgress';
import StatsCard from '@/components/Cards/StatsCard';

// d3
import Top10countries from './Dashboard/Top10countries';
import Proportion_chart from './Dashboard/proportion_chart';
import Animation_map from './Dashboard/animation_map';
import Side_barchart1 from './Dashboard/side_bar1.vue';
import Side_barchart2 from './Dashboard/side_bar2.vue';
import Side_text from './Dashboard/text.vue';


export default {
  components: {
    LineChart,
    BarChart,
    BaseProgress,
    StatsCard,
    Top10countries,
    // Top10countries1,
    Proportion_chart,
    Animation_map,
    Side_barchart1,
    Side_barchart2,
    Side_text
  },
  data() {
    return {
      map: {
        height: 800,
        width: 510,
      },
      bigLineChart: {
        allData: [
          [0, 20, 10, 30, 15, 40, 20, 60, 60],
          [0, 20, 5, 25, 10, 30, 15, 40, 40]
        ],
        activeIndex: 0,
        chartData: {
          datasets: [
            {
              label: 'Performance',
              data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
            }
          ],
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        extraOptions: chartConfigs.blueChartOptions,
      },
      redBarChart: {
        chartData: {
          labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Sales',
            data: [25, 20, 30, 22, 17, 29]
          }]
        },
        extraOptions: chartConfigs.blueChartOptions
      }
    };
  },
  methods: {
    initBigChart(index) {
      let chartData = {
        datasets: [
          {
            label: 'Performance',
            data: this.bigLineChart.allData[index]
          }
        ],
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      };
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = index;
    }


  },
  mounted(){
    // window.addEventListener("resize", this.resize_map, true);
  }
};




</script>
<style>
.el-table .cell {
  padding-left: 0px;
  padding-right: 0px;
}

.my-custom-class .card-title {
   font-size: 3.3em;
}
</style>
