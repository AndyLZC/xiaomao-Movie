<template>
  <div ref="wrapper" class="scroll-wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1,
      discription:
        "1会非实时（屏幕滑动超过一定时间后）派发scroll 事件, 2 实时的派发 scroll 事件"
    },
    click: {
      type: Boolean,
      default: true,
      discription: "开启单击事件"
    },
    dblclick: {
      type: Boolean,
      default: true,
      discription: "开启双击事件"
    },
    tap: {
      type: Boolean,
      default: true,
      discription: "派发一个tap事件"
    },
    data: {
      type: [Array, Object],
      default: null,
      discription: "监听数据变化"
    },
    listenScroll: {
      type: Boolean,
      default: false,
      discription: "监听滚动事件"
    },
    pullingUp: {
      type: Boolean,
      default: false,
      discription: "监听上拉事件"
    },
    pullingDown: {
      type: Boolean,
      default: false,
      discription: "监听下拉事件"
    },
    beforeScroll: {
      type: Boolean,
      default: false,
      discription: "监听到底事件"
    },
    freeScroll: {
      type: Boolean,
      default: false,
      discription: "开启横纵向滚动"
    },
    scrollY: {
      type: Boolean,
      default: true,
      discription: "开启纵向滚动"
    },
    scrollX: {
      type: Boolean,
      default: false,
      discription: "开启横向滚动"
    },
    bounce: {
      type: Object,
      default: () => {
        return {
          top: false,
          bottom: true,
          left: true,
          right: true
        };
      }
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  // 确保DOM已经加载了
  mounted() {
    let timer = setTimeout(() => {
      this.initScroll();
      clearTimeout(timer);
    }, 30);
  },
  methods: {
    initScroll() {
      // 判断滚动的DOM是否已经加载了
      if (!this.$refs.wrapper) {
        return;
      }
      // 初始化滚动
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: this.scrollY,
        scrollX: this.scrollX,
        freeScroll: this.freeScroll,
        probeType: this.probeType,
        click: this.click,
        dblclick: this.dblclick,
        HWCompositing: false,
        bounce: this.bounce,
        //bounceTime: 800,
        //deceleration: 0.00015,
        pullUpLoad: {
          threshold: -20
        },
        pullDownRefresh: this.pullingDown
          ? {
              threshold: 90,
              stop: 40
            }
          : false
      });

      // 监听滚动事件
      if (this.listenScroll) {
        let me = this;
        this.scroll.on("scroll", pos => {
          me.$emit("scroll", pos);
        });
      }
      // 监听上拉加载
      if (this.pullingUp) {
        this.scroll.on("pullingUp", () => {
          // if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
          this.$emit("pullingUp");
          // }
        });
      }
      // 监听下拉刷新
      if (this.pullingDown) {
        this.scroll.on("pullingDown", () => {
          // if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
          this.$emit("pullingDown");
          // }
        });
      }
      // 监听滚动开始之前
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      let timer = setTimeout(() => {
        if (this.scroll) {
          this.scroll.finishPullDown();
          this.scroll.finishPullUp();
          this.scroll.refresh();
        } else {
          this.initScroll();
        }
        // console.log('刷新了')
        clearTimeout(timer);
      }, 400);
    }
  }
};
</script>

<style scoped lang="scss">
.scroll-wrapper {
  position: absolute;
  width: 100%;
  overflow: hidden;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
