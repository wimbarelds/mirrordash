<template>
    <div class="weather-day-card">
        <h2>{{ date }}</h2>
        <header>
            <div class="icon" :class="icon">
                <span class="probability" v-if="hasPrecipitationIcon">{{ precipitation.probability }}</span>
            </div>
            <div class="temperature">{{ temperature.high }}</div>
        </header>
        <p>{{ summary }}</p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { WeatherIcon, DataPointDaily } from './Weather.types';

const dateStr = (timestamp:number):string => {
    const months = [ 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    const d = new Date(timestamp);
    const day = d.getDate();
    const month = months[d.getMonth() + 1];
    return `${day} ${month}`;
};

export default Vue.extend({
    props: {
        data: [DataPointDaily, Object]
    },
    computed: {
        temperature():any {
            return {
                high: Math.round(this.data.temperatureHigh),
                low: Math.round(this.data.temperatureLow)
            };
        },
        icon():string {
            return this.data.icon || 'clear-day';
        },
        summary():string {
            return this.data.summary ? this.data.summary : '...';
        },
        date():string {
            const date = dateStr(this.data.time * 1000);
            const today = dateStr(Date.now());
            const tomorrow = dateStr(Date.now() + 1000 * 60 * 60 * 24);
            if (date === today) return 'Today';
            if (date === tomorrow) return 'Tomorrow';
            return date;
        },
        hasPrecipitationIcon():boolean {
            return ['rain', 'snow', 'sleet'].indexOf(this.icon) !== -1;
        },
        precipitation():any {
            return {
                probability: this.data.precipProbability ? Math.round(this.data.precipProbability * 100) : 0,
                intensity: this.data.precipIntensity || 0
            };
        }
    },
    mounted() {
        this.data.temperatureLow;
        this.data.temperatureHigh;
        this.data.icon;
        this.data.time;
        this.data.summary;
        this.data.precipProbability;
        this.data.precipIntensity;
    }
});
</script>

<style lang="scss" scoped>
.weather-day-card {
    background-color: rgba(255, 255, 255, 0.05);
    width: 200px;
    margin: 10px;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

h2 {
    font-size: 32px;
    text-transform: capitalize;
    text-align: center;
    margin: 20px 0 0;
}

.icon {
    width: 100px;
    height: 100px;
    background-size: contain;

    &.clear-day             { background-image: url(../../assets/weather/Sun.svg); }
    &.clear-night           { background-image: url(../../assets/weather/Moon.svg); }
    &.rain                  { background-image: url(../../assets/weather/Cloud-Drizzle.svg); }
    &.snow                  { background-image: url(../../assets/weather/Cloud-Snow-Alt.svg); }
    &.sleet                 { background-image: url(../../assets/weather/Cloud-Hail.svg); }
    &.wind                  { background-image: url(../../assets/weather/Wind.svg); }
    &.fog                   { background-image: url(../../assets/weather/Cloud-Fog.svg); }
    &.cloudy                { background-image: url(../../assets/weather/Cloud.svg); }
    &.partly-cloudy-day     { background-image: url(../../assets/weather/Cloud-Sun.svg); }
    &.partly-cloudy-night   { background-image: url(../../assets/weather/Cloud-Moon.svg); }

    position: relative;

    .probability {
        position: absolute;
        bottom: 5px;
        right: 5px;
        color: #FFF;
        font-size: 14px;

        &::after {
            content: '%';
        }
    }
}

header {
    display: flex;
    align-items: center;
}

.temperature {
    font-size: 48px;
    width: 100px;
    text-align: center;

    &::after {
        content: '\00b0';
    }
}

p {
    padding: 0 15px;
    text-align: left;
}

</style>
