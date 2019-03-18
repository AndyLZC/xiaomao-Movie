<template>
  <svg class="icon-svg" aria-hidden="true" :width="`${width}`" :height="`${height}`">
    <use :xlink:href="`#${name}`" :style="`fill:${fill}`"></use>
  </svg>
</template>

<script>
export default {
  name: "icon-svg",
  props: {
    name: {
      type: String,
      default: ""
    },
    fill: {
      type: String,
      default: "#696969"
    },
    width: {
      type: String,
      default: "15"
    },
    height: {
      type: String,
      default: "15"
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-svg {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>