<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
    </div>
</template>
 
<script>
import BScroll from "better-scroll";
export default {
    props: {
        gap: {
            type: Number,
            default: 0
        },
        probeType: {
            type: Number,
            default: 1
        },
        data: {
            type: [Array, Object],
            default: null,
            discription: "监听数据变化"
        },
        click: {
            type: Boolean,
            default: true,
            discription: "开启单击事件"
        },
        listenScroll: {
            type: Boolean,
            default: false,
            discription: "监听滚动事件"
        },
        freeScroll: {
            type: Boolean,
            default: false,
            discription: "开启横纵向滚动"
        },
        scrollY: {
            type: Boolean,
            default: false,
            discription: "开启纵向滚动"
        },
        scrollX: {
            type: Boolean,
            default: true,
            discription: "开启横向滚动"
        },
        bounce: {
            type: Object,
            default: () => {
                return {
                    top: true,
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
        this.$nextTick(() => {
            this._initScroll();
        });
    },
    methods: {
        _setSliderWidth() {
            let width = 0;
            let children = this.$refs.sliderGroup.children;
            Array.from(children).forEach(child => {
                width += child.clientWidth + this.gap;
            });
            this.$refs.sliderGroup.style.width = width + "px";
        },
        _initScroll() {
            // 判断滚动的DOM是否已经加载了
            if (!this.$refs.slider) {
                return;
            }
            this._setSliderWidth();
            // 初始化滚动
            this.scroll = new BScroll(this.$refs.slider, {
                scrollY: this.scrollY,
                scrollX: this.scrollX,
                freeScroll: this.freeScroll,
                click: this.click,
                probeType: this.probeType,
                HWCompositing: false,
                bounce: this.bounce,
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
                    this.$emit("pullingUp");
                });
            }
            // 监听下拉刷新
            if (this.pullingDown) {
                this.scroll.on("pullingDown", () => {
                    this.$emit("pullingDown");
                });
            }
            // 监听滚动开始之前
            if (this.scrollEnd) {
                this.scroll.on("scrollEnd", () => {
                    this.$emit("scrollEnd");
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
            this.scroll &&
                this.scroll.scrollToElement.apply(this.scroll, arguments);
        }
    },
    watch: {
        data() {
            let timer = setTimeout(() => {
                if (this.scroll) {
                    this._setSliderWidth();
                    this.scroll.refresh();
                } else {
                    this.initScroll();
                }
                clearTimeout(timer);
            }, 400);
        }
    }
};
</script>

<style lang="scss" scoped>
.slider {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
}
.slider-group {
    display: flex;
}
</style>
