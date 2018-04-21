<template>
    <div class="schedule">
        <div class="bus" v-for="nextBus in nextBusses" :key="nextBus.time">
            <span class="bus-time-value">{{ nextBus.time }}</span>
            <span class="bus-time-unit">{{ nextBus.unit }}</span>
        </div>
        <div class="no-data" v-if="nextBusTimes.length === 0">
            No bus data
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { setInterval, setTimeout } from 'timers';

class ComponentData {
    public nextBusTimes: number[] = [];
    public nextBusTimeout: number = 0;
}

class NextBus {
    public time: string = "";
    public unit: string = "";
}

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;

export default Vue.extend({
    data: ():ComponentData => ({
        nextBusTimes: [],
        nextBusTimeout: 0
    }),
    computed: {
        nextBusses():NextBus[] {
            const now = Date.now();
            return this.nextBusTimes.map((nextBusTime:number):NextBus => {
                const minutes = Math.floor((nextBusTime - now) / minute);
                if (minutes < 1) return { time: "< 1", unit: "minutes" };
                if (minutes < 60) return { time: minutes.toString(), unit: "minutes" };

                const date = new Date(nextBusTime);
                const hoursStr = date.getHours().toString();
                const minutesStr = date.getMinutes().toString().padStart(2, '0');
                return { time: `${hoursStr}:${minutesStr}`, unit: '' };
            });
        }
    },
    methods: {
        getNextBus() {
            fetch('./ov.php')
                .then((r) => r.json())
                .then((data) => {
                    const now:number = Date.now();
                    const times:number[] = [];

                    const locationCode:string = Object.keys(data)[0];
                    const stops:any = Object.values(data[locationCode]);
                    for(let stop of stops) {
                        var passes:any = Object.values(stop.Passes);
                        for(let pass of passes) {
                            if (pass.DestinationName50.indexOf('Beijum') === -1) {
                                const time = (new Date(pass.ExpectedArrivalTime)).getTime();
                                if (time > now) times.push(time);
                            }
                        }
                    }
                    times.sort();

                    var soon = (times.filter((t) => (t - now) < hour));
                    this.nextBusTimes = (soon.length > 0) ? soon.slice(0, 4) : times.slice(0, 1);
                });

            window.setTimeout(this.getNextBus.bind(this), minute);
        }
    },
    mounted() {
        this.getNextBus()
    },
    beforeDestroy() {
        window.clearTimeout(this.nextBusTimeout);
    }
});
</script>

<style lang="scss" scoped>
    .bus {
        display: flex;
        align-items: flex-end;
        margin-bottom: 20px;

        &::before {
            content: '';
            display: block;
            background-image: url('../assets/bus/Bus_stop_symbol.svg');
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            width: 100px;
            height: 100px;
            transform: translateY(-4px)
        }

        .bus-time-value {
            line-height: 100px;
            font-size: 100px;
            margin: 0 10px 0 10px;
        }

        .bus-time-unit {
            font-size: 40px;
            line-height: 60px;
            opacity: .75;
        }
    }
</style>
