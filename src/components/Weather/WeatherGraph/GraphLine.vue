<template>
    <path :d="temperaturePath" :stroke="color" fill="transparent" stroke-width="1" />
</template>

<script lang="ts">
import { Point, RangePoint, Range, Scaler } from './GraphTools';
import Vue from 'vue'
export default Vue.extend({
    props: {
      color: String,
      xRange: Object as () => Range,
      yRange: Object as () => Range,
      data: Array as () => Point[],
      scaler: Scaler
    },
    computed: {
        temperaturePath():string {
            let paths:string[] = [];
            if (this.xRange && this.yRange) {
                for (let i = 0; i < this.data.length; i++) {
                    let value:Point = this.data[i];
                    let x = this.scaler.x((value.x - this.xRange.min) / (this.xRange.max - this.xRange.min));
                    let y = this.scaler.y((value.y - this.yRange.min) / (this.yRange.max - this.yRange.min));
                    let char = (i === 0) ? 'M' : 'L';
                    paths.push(`${char} ${x} ${y}`);
                }
            }
            return paths.join(' ');
        }
    }
})
</script>

<style lang="scss" scoped>

</style>
