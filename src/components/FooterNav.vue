<template>
  <div class="footer-nav-bar" v-show="$route.meta.showFooter">
    <div
      :class="['nav-icon-wrapper', 'ripple', {'is-active': $route.path == item.path}]"
      v-for="(item, index) in iconList"
      :key="index"
      @click="onChangeNav(item, index)"
    >
      <icon-svg
        class="nav-icon"
        width="23"
        height="23"
        :name="item.name"
        :fill="$route.path == item.path ? '#e54847' : '#696969'"
      ></icon-svg>
      <span class="nav-text">{{item.title}}</span>
    </div>
  </div>
</template>

<script>
import IconSvg from "./IconSvg";
export default {
  name: "FooterNav",
  data() {
    return {
      iconList: [
        {
          name: "movie",
          path: "/movie",
          title: "电影"
        },
        {
          name: "cinema",
          path: "/cinema",
          title: "影院"
        },
        {
          name: "boxOffice",
          path: "/boxOffice",
          title: "票房"
        },
        {
          name: "myCenter",
          path: "/myCenter",
          title: "我的"
        }
      ]
    };
  },
  components: {
    IconSvg
  },
  methods: {
    onChangeNav(item, index) {
      this.$router.push(item.path);
    }
  }
};
</script>

<style lang="scss" scoped>
.footer-nav-bar {
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  height: 50px;
  @include border-1px(top);
  position: fixed;
  background-color: #fff;
  z-index: 2999;

  .nav-icon-wrapper {
    flex: 1;
    color: $subThemeColor;
    text-align: center;
    font-size: 10px;
  }

  .is-active {
    color: $themeColor;
  }
  .nav-icon {
    display: block;
    margin: 7px auto;
  }
}
</style>