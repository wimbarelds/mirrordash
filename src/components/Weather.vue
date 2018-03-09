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

const interval = 15 * 60 * 1000;

class ResponseData {
    public latitude:number = 0;
    public longitude:number = 0;
    public timezone:string = '';
    public currently?:DataPoint;
    public hourly?:DataBlock;
    public daily?:DataBlockDaily;
}

class ComponentData {
    public today:DataPointDaily|null = null;
    public tomorrow:DataPointDaily|null = null;
    public hourly:DataBlock|null = null;
    public daily:DataBlockDaily|null = null;
    public updateInterval:number = 0;
}

const getForecast:Function = (() => {
    const latitude = 53.227910;
    const longitude = 6.569886
    const exclude = ['minutely', 'alerts', 'flags'].join(',');
    const ApiURL = `https://api.darksky.net/forecast/{APIKEY}/${latitude},${longitude}?exclude=${exclude}&lang=nl&units=ca`;
    const proxyURL = './weather.php';
    return function (latitude:number, longitude:number):Promise<Response> {
        const formdata = new FormData();
        formdata.append('url', `${ApiURL}`);
        return fetch(proxyURL, {
            method: 'POST',
            body: formdata
        });
    };
})();

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
            getForecast()
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