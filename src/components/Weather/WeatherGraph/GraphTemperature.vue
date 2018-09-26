<template>
    <g id="temperature">
        <defs>
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop v-for="(color, index) in gradientColors" :key="index"
                    :offset="Math.floor(index / (gradientColors.length - 1) * 100) + '%'"
                    :stop-color="color" />
            </linearGradient>
        </defs>
        <g id="FillSegment">
            <path :d="fillPath" stroke="transparent" fill="url(#linear)" opacity="0.8" />
        </g>
        <g id="LineSegment">
            <path :d="linePath" stroke="url(#linear)" stroke-width="1" fill="transparent" />
        </g>
        <g id="GraphPoints">
            <circle :cx="graphPoint.pos.x" :cy="graphPoint.pos.y" r="3" fill="#FFF" stroke="rgba(0,0,0,0.75)" v-for="graphPoint in graphPoints" :key="graphPoint.index" />
        </g>
        <g id="GraphTexts">
            <text :x="graphText.pos.x" :y="graphText.pos.y" v-text="graphText.text" font-size="12" fill="#FFF" text-anchor="middle" dominant-baseline="bottom" v-for="graphText in graphTexts" :key="graphText.index" />
        </g>
    </g>
</template>

<script lang="ts">
import Vue from 'vue'
import { Point, Range, Scaler } from '@/components/Weather/WeatherGraph/GraphTools';

interface LineSegment {
    index:number;
    path:string;
    stroke:string;
}

interface FillSegment {
    index:number;
    path:string;
    fill:string;
}

interface GraphPoint {
    index:number;
    pos:Point;
}

interface GraphText {
    index:number;
    pos:Point;
    text:String;
}

const colors = {
    veryCold: [0x77, 0xAA, 0xFF],
    cold: [0xFF, 0xFF, 0xFF],
    warm: [0xFF, 0xFF, 0x66],
    hot: [0xFF, 0x00, 0x00]
};

export default Vue.extend({
    props: {
      xRange: Object as () => Range,
      yRange: Object as () => Range,
      data: Array as () => Point[],
      scaler: Scaler
    },
    computed: {
        gradientColors():string[] {
            const colors:string[] = [];
            for(let i = 0; i < this.data.length; i++) {
                let point:Point = this.data[i] as Point;
                let color = this.temperatureToColor(point.y);
                colors.push(color);
            }
            return colors;
        },
        linePath():string {
            if (!this.data || !this.data.length) return '';
            let path =`M ${this.pointToScaled(this.data[0])}`;
            for(let i = 1; i < this.data.length; i++) {
                path += ` L ${this.pointToScaled(this.data[i])}`;
            }
            return path;
        },
        fillPath():string {
            if (!this.data || !this.data.length) return '';

            let path = this.linePath;

            let bottomRight:Point = { x: (this.data[this.data.length - 1]).x, y: this.yRange.min };
            path += ` L ${this.pointToScaled(bottomRight)}`;

            let bottomLeft:Point = { x: (this.data[0]).x, y: this.yRange.min };
            path += ` L ${this.pointToScaled(bottomLeft)}`;

            return path;
        },
        graphPoints():GraphPoint[] {
            const points:GraphPoint[] = [];
            for(let i = 0; i < this.data.length; i++) {
                let point:Point = this.data[i] as Point;

                points.push({
                    index: i,
                    pos: {
                        x: this.scaler.x((point.x - this.xRange.min) / (this.xRange.max - this.xRange.min)),
                        y: this.scaler.y((point.y - this.yRange.min) / (this.yRange.max - this.yRange.min))
                    }
                });
            }
            return points;
        },
        graphTexts():GraphText[] {
            const texts:GraphText[] = [];
            for(let i = 1; i + 1 < this.data.length; i++) {
                let point:Point = this.data[i] as Point;

                texts.push({
                    index: i,
                    pos: {
                        x: this.scaler.x((point.x - this.xRange.min) / (this.xRange.max - this.xRange.min)),
                        y: this.scaler.y((point.y - this.yRange.min) / (this.yRange.max - this.yRange.min)) - 10
                    },
                    text: Math.round(point.y) + '°'
                });
            }
            return texts;            
        }
    },
    methods: {
        temperatureToColor(temperature:number):string {
            if (temperature < -10) return this.temperatureInRangeToColor(0, colors.veryCold, colors.veryCold);
            if (temperature <= 0) return this.temperatureInRangeToColor(temperature / -10, colors.veryCold, colors.cold);
            if (temperature <= 15) return this.temperatureInRangeToColor(temperature / 15, colors.cold, colors.warm);
            if (temperature <= 35) return this.temperatureInRangeToColor((temperature - 15) / 20, colors.warm, colors.hot);
            return this.temperatureInRangeToColor(0, colors.hot, colors.hot);
        },
        temperatureInRangeToColor(pct:number, color0: number[], color1: number[]):string {
            let c0 = [ color0[0] * (1 - pct), color0[1] * (1 - pct), color0[2] * (1 - pct) ];
            let c1 = [ color1[0] * (pct), color1[1] * (pct), color1[2] * (pct) ];
            let r = Math.round(c0[0] + c1[0]).toString(16).padStart(2, '0');
            let g = Math.round(c0[1] + c1[1]).toString(16).padStart(2, '0');
            let b = Math.round(c0[2] + c1[2]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        },
        pointToScaled(point:Point):string {
            let x = this.scaler.x((point.x - this.xRange.min) / (this.xRange.max - this.xRange.min));
            let y = this.scaler.y((point.y - this.yRange.min) / (this.yRange.max - this.yRange.min));
            return `${x} ${y}`;
        }
    }
})
</script>
