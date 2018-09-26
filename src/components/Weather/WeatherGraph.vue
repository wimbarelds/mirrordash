<template>
    <div class="weather-graph">
        <svg width="100%" height="240" v-if="loaded">
            <g id="yRange1">
                <text v-for="yPoint in yPoints1.range" :key="yPoint.value" :x="margins.x - 5" :y="yPoint.pos" fill="#FF7" text-anchor="end" dominant-baseline="middle">{{ yPoint.text }}</text>
            </g>
            <g id="yRange2">
                <text v-for="yPoint in yPoints2.range" :key="yPoint.value" :x="size.x - margins.x + 5" :y="yPoint.pos" fill="#ACF" text-anchor="start" dominant-baseline="middle">{{ yPoint.text }}</text>
            </g>
            <g id="xRange">
                <text v-for="xPoint in xPoints.range" :key="xPoint.value" :x="xPoint.pos" :y="size.y - margins.y + 10" fill="#FFF" text-anchor="middle" dominant-baseline="hanging">{{ xPoint.text }}</text>
            </g>
            <!-- <graph-line color="#FF0" :x-range="xRange" :y-range="yRange1" :data="temperature" :scaler="scaler" /> -->
            <graph-temperature :x-range="xRange" :y-range="yRange1" :data="temperature" :scaler="scaler" />
            <graph-precipitation :x-range="xRange" :y-range="yRange2" :data="precipitation" :scaler="scaler" />
            <!-- <graph-line color="#36F" :x-range="xRange" :y-range="yRange2" :data="precipitation" :scaler="scaler" /> -->
            
            <path :d="`M ${margins.x} ${margins.y} L ${margins.x} 210 L ${size.x - margins.x} 210 L ${size.x - margins.x} ${margins.y}`" stroke="#FFF" stroke-width="2" fill="transparent" />
        </svg>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataPoint, DataBlock } from './Weather.types';
import { Point, PrecipitationPoint, RangePoint, Range, Scaler } from './WeatherGraph/GraphTools';

import GraphLine from './WeatherGraph/GraphLine.vue';
import GraphTemperature from './WeatherGraph/GraphTemperature.vue';
import GraphPrecipitation from './WeatherGraph/GraphPrecipitation.vue';

const size:Point = {
    x: 1440,
    y: 240
}
const margins:Point = {
    x: 50,
    y: 30
}

interface ComponentData {
    yRange1:Range|null;
    yRange2:Range|null;
    xRange:Range|null;
    temperature:Point[];
    precipitation:PrecipitationPoint[];
    loaded:boolean;
    size:Point;
    margins:Point;
    scaler:Scaler;
}

export default Vue.extend({
    props: {
        data: {
            type: Object as () => DataBlock
        }
    },
    data: ():ComponentData => ({
        yRange1: null,
        yRange2: null,
        xRange: null,
        temperature: [],
        precipitation: [],
        loaded: false,
        size: size,
        margins: margins,
        scaler: new Scaler(size, margins)
    }),
    computed: {
        xPoints():Range|null {
            if (this.xRange === null) return null;
            const rangePoints:RangePoint[] = [];
            const computedRange:Range = {
                min: this.xRange.min,
                max: this.xRange.max,
                range: this.xRange.range
            };

            computedRange.range.forEach((rangePoint:RangePoint) => {
                rangePoint.pos = this.scaler.x((rangePoint.value - computedRange.min) / (computedRange.max - computedRange.min));
            });

            return computedRange;
        },
        yPoints1():Range|null {
            if (this.yRange1 === null) return null;
            const computedRange:Range = {
                min: this.yRange1.min,
                max: this.yRange1.max,
                range: this.yRange1.range
            };

            computedRange.range.forEach((rangePoint:RangePoint) => {
                rangePoint.pos = this.scaler.y((rangePoint.value - computedRange.min) / (computedRange.max - computedRange.min));
            });

            return computedRange;
        },
        yPoints2():Range|null {
            if (this.yRange2 === null) return null;
            const computedRange:Range = {
                min: this.yRange2.min,
                max: this.yRange2.max,
                range: this.yRange2.range
            };

            computedRange.range.forEach((rangePoint:RangePoint) => {
                rangePoint.pos = this.scaler.y((rangePoint.value - computedRange.min) / (computedRange.max - computedRange.min));
            });

            return computedRange;
        },
    },
    methods: {
        setYRange1(values:number[]) {
            let minVal = 0;
            let maxVal = 30;
            for(let value of values) {
                if (value < minVal) minVal = value;
                if (value > maxVal) maxVal = value;
            }

            let minRounded = Math.floor(minVal / 10) * 10;
            let maxRounded = Math.ceil(maxVal / 10) * 10;
            let range:RangePoint[] = [];
            for (let rangePoint = minRounded; rangePoint <= maxRounded; rangePoint += 10) {
                range.push({
                    value: rangePoint,
                    text: rangePoint.toString() + '°',
                    pos: 0
                });
            }

            this.yRange1 = {
                min: minRounded,
                max: maxRounded,
                range: range
            };
        },
        setYRange2(values:number[]) {
            let minVal = 0;
            let maxVal = 1;
            for(let value of values) {
                if (value < minVal) minVal = value;
                if (value > maxVal) maxVal = value;
            }

            let range:RangePoint[] = [];
            for (let rangePoint = minVal; rangePoint <= maxVal; rangePoint += 0.2) {
                range.push({
                    value: rangePoint,
                    text: Math.floor(rangePoint * 100).toString() + '%',
                    pos: 0
                });
            }

            this.yRange2 = {
                min: minVal,
                max: maxVal,
                range: range
            };
        },
        setXRange(values:number[]) {
            let minVal = Number.MAX_SAFE_INTEGER;
            let maxVal = Number.MIN_SAFE_INTEGER;
            for(let value of values) {
                if (value < minVal) minVal = value;
                if (value > maxVal) maxVal = value;
            }

            let range:RangePoint[] = [];
            for (let rangePoint = minVal; rangePoint <= maxVal; rangePoint += (1000 * 60 * 60)) {
                let date = new Date(rangePoint);
                range.push({
                    value: rangePoint,
                    text: date.getHours().toString() + ':00',
                    pos: 0
                });
            }

            this.xRange = {
                min: minVal,
                max: maxVal,
                range: range
            };
        },
        update() {
            const hours:DataPoint[] = (this.data).data.slice(0, 24);
            const temperatureValues:number[] = [];
            const precipitationProbability:number[] = [];
            const times:number[] = [];
            this.temperature = [];
            this.precipitation = [];
            hours.forEach((hour) => {
                if (hour && hour.temperature) temperatureValues.push(hour.temperature);
                if (hour && hour.precipProbability) precipitationProbability.push(hour.precipProbability);
                if (hour && hour.time) times.push(hour.time * 1000);
                if (hour && hour.temperature && hour.time) this.temperature.push({ x: hour.time * 1000, y: hour.temperature });
                if (hour && hour.time){
                    if (hour.precipProbability && hour.precipIntensity) {
                        this.precipitation.push({ x: hour.time * 1000, y: hour.precipProbability, h: hour.precipIntensity });
                    }
                    else {
                        this.precipitation.push({ x: hour.time * 1000, y: 0, h: 0 });
                    }
                }
            });
            this.setYRange1(temperatureValues);
            this.setYRange2(precipitationProbability);
            this.setXRange(times);
        }
    },
    watch: {
        data() {
            this.update();
        }
    },
    mounted() {
        this.size.x = this.$el.offsetWidth;
        this.update();
        this.loaded = true;
    },
    components: {
        GraphLine,
        GraphTemperature,
        GraphPrecipitation
    }
});
</script>

<style lang="scss" scoped>
    .weather-graph {
        margin: 10px;
        flex: 1;
    }
</style>
