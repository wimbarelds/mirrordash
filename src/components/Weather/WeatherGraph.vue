<template>
    <div class="weather-graph">
        <svg width="100%" height="240" v-if="loaded">
            <g id="yRange1">
                <text v-for="yPoint in yPoints1.range" :key="yPoint.value" :x="margin - 5" :y="yPoint.pos" fill="#FFF" text-anchor="end" dominant-baseline="middle">{{ yPoint.text }}</text>
            </g>
            <g id="yRange2">
                <text v-for="yPoint in yPoints2.range" :key="yPoint.value" :x="width - margin + 5" :y="yPoint.pos" fill="#FFF" text-anchor="start" dominant-baseline="middle">{{ yPoint.text }}</text>
            </g>
            <g id="xRange">
                <text v-for="xPoint in xPoints.range" :key="xPoint.value" :x="xPoint.pos" :y="height - margin + 5" fill="#FFF" text-anchor="middle" dominant-baseline="hanging">{{ xPoint.text }}</text>
            </g>
            <path :d="temperaturePath" stroke="#FF0" stroke-width="1" fill="rgba(255, 255, 0, 0.05)" />
            <path :d="precipitationPath" stroke="#36F" stroke-width="1" fill="rgba(30, 60, 255, 0.05)" />
            <path :d="`M ${margin} ${margin} L ${margin} 210 L ${width - margin} 210 L ${width - margin} ${margin}`" stroke="#FFF" stroke-width="2" fill="transparent" />
        </svg>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataPoint, DataBlock } from './Weather.types';

let width:number = 1440;
const height:number = 240;
const margin:number = 30;

const scaleX = (pct:number):number => Math.round(margin + ((width - (margin * 2)) * pct));
const scaleY = (pct:number):number => height - Math.round(margin + ((height - (margin * 2)) * pct));

class Point {
    public x:number = 0;
    public y:number = 0;
}

class RangePoint {
    public value:number = 0;
    public text:string = '';
    public pos:number = 0;
}

class Range {
    public min:number = 0;
    public max:number = 30;
    public range:RangePoint[] = [];
}

class ComponentData {
    public yRange1:Range|null = null;
    public yRange2:Range|null = null;
    public xRange:Range|null = null;
    public temperature:Point[] = [];
    public precipitation:Point[] = [];
    public loaded:boolean = false;
    public width:number = 1440;
    public height:number = 240;
    public margin:number = 40;
}

export default Vue.extend({
    props: {
        data: [DataBlock, Object]
    },
    data: ():ComponentData => ({
        yRange1: null,
        yRange2: null,
        xRange: null,
        temperature: [],
        precipitation: [],
        loaded: false,
        width: width,
        height: height,
        margin: margin,
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
                rangePoint.pos = scaleX((rangePoint.value - computedRange.min) / (computedRange.max - computedRange.min));
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
                rangePoint.pos = scaleY((rangePoint.value - computedRange.min) / (computedRange.max - computedRange.min));
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
                rangePoint.pos = scaleY((rangePoint.value - computedRange.min) / (computedRange.max - computedRange.min));
            });

            return computedRange;
        },
        temperaturePath():string {
            let paths:string[] = [];
            if (this.xRange && this.yRange1) {
                paths.push('M ' + scaleX(1) + ' ' + scaleY(0));
                paths.push('L ' + scaleX(0) + ' ' + scaleY(0));
                for (let i = 0; i < this.temperature.length; i++) {
                    let value:Point = this.temperature[i];
                    let x = scaleX((value.x - this.xRange.min) / (this.xRange.max - this.xRange.min));
                    let y = scaleY((value.y - this.yRange1.min) / (this.yRange1.max - this.yRange1.min));
                    paths.push(`L ${x} ${y}`);
                }
                paths.push(paths[0]);
            }
            return paths.join(' ');
        },
        precipitationPath():string {
            let paths:string[] = [];
            if (this.xRange && this.yRange2) {
                paths.push('M ' + scaleX(1) + ' ' + scaleY(0));
                paths.push('L ' + scaleX(0) + ' ' + scaleY(0));
                for (let i = 0; i < this.precipitation.length; i++) {
                    let value:Point = this.precipitation[i];
                    let x = scaleX((value.x - this.xRange.min) / (this.xRange.max - this.xRange.min));
                    let y = scaleY((value.y - this.yRange2.min) / (this.yRange2.max - this.yRange2.min));
                    paths.push(`L ${x} ${y}`);
                }
                paths.push(paths[0]);
            }
            let path:string = paths.join(' ');
            console.log(path);
            return path;
        }
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
                    text: rangePoint.toString(),
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
                    text: Math.floor(rangePoint * 100).toString(),
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
                    text: date.getHours().toString(),
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
            const hours:DataPoint[] = this.data.data.slice(0, 24);
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
                if (hour && hour.precipProbability && hour.time) this.precipitation.push({ x: hour.time * 1000, y: hour.precipProbability });
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
        this.width = width = this.$el.offsetWidth;
        this.update();
        this.loaded = true;
    }
});
</script>

<style lang="scss" scoped>
    .weather-graph {
        margin: 10px;
        background-color: rgba(255, 255, 255, 0.05);
        flex: 1;
    }
</style>
