<template>
  <div class="weather">
      <weather-graph :data="hourly" v-if="hourly != null" />
      <weather-day-summary :data="today" v-if="today != null" />
      <weather-day-summary :data="tomorrow" v-if="tomorrow != null" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { WeatherIcon, DataPoint, DataPointDaily, DataBlock, DataBlockDaily } from './Weather/Weather.types';
import WeatherDaySummary from './Weather/WeatherDaySummary.vue';
import WeatherGraph from './Weather/WeatherGraph.vue';
import config from '../config';

const interval = 15 * 60 * 1000;

interface ResponseData {
    latitude:number;
    longitude:number;
    timezone:string;
    currently?:DataPoint;
    hourly?:DataBlock;
    daily?:DataBlockDaily;
}

class ComponentData {
    public today:DataPointDaily|null = null;
    public tomorrow:DataPointDaily|null = null;
    public hourly:DataBlock|null = null;
    public daily:DataBlockDaily|null = null;
    public updateInterval:number = 0;
}

export default Vue.extend({
    data: ():ComponentData => ({
        today: null,
        tomorrow: null,
        hourly: null,
        daily: null,
        updateInterval: 0
    }),
    computed: {
    },
    methods: {
        update() {
            fetch(config.WEATHER_API_URL)
                .then((response:Response) => response.json())
                .then((data:ResponseData) => {
                    if(data.daily) {
                        if(data.daily.data[0]) this.today = data.daily.data[0];
                        if(data.daily.data[1]) this.tomorrow = data.daily.data[1];
                        this.daily = data.daily;
                    }
                    if(data.hourly) {
                        this.hourly = data.hourly;
                    }
                });
        }
    },
    mounted() {
        this.updateInterval = window.setInterval(this.update.bind(this), interval);
        this.update();
    },
    beforeDestroy() {
        window.clearInterval(this.updateInterval);
    },
    components: {
        WeatherDaySummary,
        WeatherGraph
    }
});
</script>

<style lang="scss" scoped>
    img[src*="/wi-"] {
        max-width: 200px;
    }

    .weather {
        display: flex;
    }
</style>