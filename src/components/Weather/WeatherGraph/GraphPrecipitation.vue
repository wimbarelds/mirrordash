<template>
    <g id="Precipitation">
        <path :d="precipitationChance" stroke="#369" stroke-width="2" fill="transparent" />
        <path :d="precipitationIntensity" fill="rgba(51, 102, 153, 0.5)" />
    </g>
</template>

<script lang="ts">
const curveStrength:number = 0.33;
import { Point, PrecipitationPoint, RangePoint, Range, Scaler } from './GraphTools';
import Vue from 'vue'
export default Vue.extend({
    props: {
      color: String,
      xRange: Object as () => Range,
      yRange: Object as () => Range,
      data: Array as () => PrecipitationPoint[],
      scaler: Scaler
    },
    methods: {
        rangeCap(y:number) {
            let minY = this.scaler.y(this.yRange.min);
            if (y > minY) return minY;

            let maxY = this.scaler.y(this.yRange.max);
            if (y < maxY) return maxY;

            return y;
        },
    },
    computed: {
        precipitationChance():string {
            let points:Point[] = [];
            if (this.xRange && this.yRange) {
                for (let i = 0; i < this.data.length; i++) {
                    let value:PrecipitationPoint = this.data[i];
                    let x:number = this.scaler.x((value.x - this.xRange.min) / (this.xRange.max - this.xRange.min));
                    let y:number = this.scaler.y((value.y - this.yRange.min) / (this.yRange.max - this.yRange.min));
                    points.push({x: x, y: y });
                }
            }

            let string = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                let from    = points[i - 1];
                let to      = points[i];
                let before  = (i === 1) ? points[0] : points[i - 2];
                let after   = (i + 1 === points.length) ? points[i] : points[i + 1];

                let deltaFrom:number = (to.y - before.y) * curveStrength;
                let deltaTo:number   = (after.y - from.y) * curveStrength;

                let px0:number = (from.x * (1 - curveStrength)) + (to.x * curveStrength);
                let px1:number = (from.x * curveStrength) + (to.x * (1 - curveStrength));
                let py0:number = this.rangeCap(from.y + deltaFrom);
                let py1:number = this.rangeCap(to.y - deltaTo);

                string += ` C ${px0} ${py0} ${px1} ${py1} ${to.x} ${to.y}`;
            }

            return string;
        },
        precipitationIntensity():string {
            let top:Point[] = [];
            let bottom:Point[] = [];

            if (this.xRange && this.yRange) {
                for (let i = 0; i < this.data.length; i++) {
                    let value:PrecipitationPoint = this.data[i];
                    let h:number = Math.round(value.h * 20);
                    let x:number = this.scaler.x((value.x - this.xRange.min) / (this.xRange.max - this.xRange.min));
                    let yBottom:number = this.scaler.y((value.y - this.yRange.min) / (this.yRange.max - this.yRange.min)) - (h / 2);
                    let yTop:number = yBottom + h;
                    top.push({x: x, y: yTop });
                    bottom.push({x: x, y: yBottom });
                }
            }

            bottom.reverse();


            let string = `M ${top[0].x} ${top[0].y}`;
            for (let i = 1; i < top.length; i++) {
                let from    = top[i - 1];
                let to      = top[i];
                let before  = (i === 1) ? top[0] : top[i - 2];
                let after   = (i + 1 === top.length) ? top[i] : top[i + 1];

                let deltaFrom:number = (to.y - before.y) * curveStrength;
                let deltaTo:number   = (after.y - from.y) * curveStrength;

                let ph0:number = (from.x * (1 - curveStrength)) + (to.x * curveStrength);
                let ph1:number = (from.x * curveStrength) + (to.x * (1 - curveStrength));

                string += ` C ${ph0} ${from.y + deltaFrom} ${ph1} ${to.y - deltaTo} ${to.x} ${to.y}`;
            }
            for (let i = 1; i < bottom.length; i++) {
                let from    = bottom[i - 1];
                let to      = bottom[i];
                let before  = (i === 1) ? bottom[0] : bottom[i - 2];
                let after   = (i + 1 === bottom.length) ? bottom[i] : bottom[i + 1];

                let deltaFrom:number = (to.y - before.y) * curveStrength;
                let deltaTo:number   = (after.y - from.y) * curveStrength;

                let ph0:number = (from.x * (1 - curveStrength)) + (to.x * curveStrength);
                let ph1:number = (from.x * curveStrength) + (to.x * (1 - curveStrength));

                string += ` C ${ph0} ${from.y + deltaFrom} ${ph1} ${to.y - deltaTo} ${to.x} ${to.y}`;
            }

            return string;
        }
    }
})
</script>

<style lang="scss" scoped>

</style>
