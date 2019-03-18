<template>
  <transition name="fade" tag="div">
    <Scroll v-if="cinemaList.length" class="cinema-container">
      <div class="cinema-list">
        <cinema-item :cinema="cinema" v-for="cinema in cinemaList" :key="cinema.id"></cinema-item>
      </div>
    </Scroll>
  </transition>
</template>

<script>
import CinemaItem from "./CinemaItem";
import Scroll from "/components/Scroll";
export default {
  data() {
    return {};
  },
  props: {
    cinemaList: {
      type: Array
    }
  },
  components: {
    CinemaItem,
    Scroll
  }
};
</script>

<style lang="scss" scoped>
.cinema-container {
  // position: relative;
  // //z-index: 4;
  margin-top: 137px;
  margin-bottom: 51px;
}
</style>