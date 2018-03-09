<template>
  <div class="date-time">
    <div class="time">{{ time }}</div>
    <div class="date">{{ date }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { setInterval } from 'timers';

export default Vue.extend({
    data: () => ({
        datetime: new Date(),
        datetimeInterval: 0
    }),
    computed: {
        time():String {
            const hours:String = this.datetime.getHours().toString();
            const minutes:String = this.datetime.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`
        },
        date():String {
            const months = [ 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
            const day = this.datetime.getDate();
            const month = months[this.datetime.getMonth() + 1];
            const year = this.datetime.getFullYear();
            return `${day} ${month}, ${year}`;
        }
    },
    mounted() {
        this.datetimeInterval = window.setInterval(() => {
            this.datetime = new Date();
        }, 1000)
    },
    beforeDestroy() {
        window.clearInterval(this.datetimeInterval);
    }
});
</script>

<style lang="scss" scoped>
    .date-time {
        display: block;
    }
    .time {
        font-size: 150px;
        font-weight: bold;
        text-align: center;
    }
    .date {
        font-size: 48px;
        text-align: center;
    }
</style>
