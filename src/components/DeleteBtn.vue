<template>
<transition name="fade">
  <div class="delete-btn" @click="hideBtn">
      <div class="btn-wrap" @click.stop="handleDelete()">
          删除
      </div>
  </div>
</transition>
</template>

<script>
export default {
  data() {
    return {
        
    }
  },
  components: {

  },
  methods: {
      handleDelete() {
          this.$emit('delete-one')
      },
      hideBtn() {
          this.$emit('hide-btn')
      }
  }
}
</script>

<style lang="scss" scoped>
    .delete-btn {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background-color: rgba(255, 255, 255, .85);
        .btn-wrap {
            @include center;
            width: 62%;
            line-height: 48px;
            border-radius: 5px;
            box-shadow: 0px 2px 20px 5px rgba(0, 0, 0, 0.1);;
            text-align: center;
            color: #fff;
            font-size: 16px;
            background-color: $themeColor;
        }
    }
</style>