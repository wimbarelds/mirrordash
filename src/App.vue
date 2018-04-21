<template>
  <div id="app">
    <date-time class="date-time" />
    <next-bus class="next-bus" />
    <weather class="weather" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DateTime from './components/DateTime.vue';
import NextBus from './components/NextBus.vue';
import Weather from './components/Weather.vue';

export default Vue.extend({
  components: {
    DateTime,
    NextBus,
    Weather
  },
  mounted() {
    if (navigator.appVersion.indexOf('Windows')) {
      document.body.classList.add('windows');
    }
  }
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto');

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #000;
  color: #FFF;
  font-family: 'Roboto', sans-serif;
  cursor: none;

  &.windows {
    cursor: default;
  }
}
</style>

<style lang="scss" scoped>
  .date-time {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .weather {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
  }

  .next-bus {
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>
