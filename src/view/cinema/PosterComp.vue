<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <div
                v-for="(movie, index) in posters"
                :key="index"
                :class="['slider-item',{'active': activeIndex == index}]"
                @click="selectMovie(movie, index)"
            >
                <img :src="fixPic(movie.img,'148.219')" alt>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
const MARGIN = 7.5;
const SCALE = 1.2;
const IMG_WIDTH = 65;
export default {
    data() {
        return {
            activeIndex: 0,
            scrollX: 0
        };
    },
    props: {
        posters: {
            type: Array
        }
    },
    mounted() {
        this.$nextTick(() => {
            this._initWidth();
            this._initScroll();
        });
    },
    methods: {
        _initWidth() {
            let sliderWidth = this.$refs.slider.clientWidth;
            let children = this.$refs.sliderGroup.children;
            let len = Array.from(children).length;
            let sliderGroupWidth = 0;
            sliderGroupWidth =
                0.5 * sliderWidth -
                (IMG_WIDTH + 2) * (SCALE / 2) +
                (IMG_WIDTH + 2) * SCALE +
                (IMG_WIDTH + MARGIN * 2) * (len - 1) -
                MARGIN +
                0.5 * sliderWidth -
                IMG_WIDTH / 2;
            this.$refs.sliderGroup.style.width = sliderGroupWidth + "px";
            this.$refs.slider.style.left =
                (sliderWidth - (IMG_WIDTH + 2) * SCALE) / 2 + "px";
        },
        _initScroll() {
            this.scroll = new BScroll(this.$refs.slider, {
                scrollX: true,
                probeType: 2,
                click: true
            });
            this.scroll.on("scroll", pos => {
                this.scrollX = pos.x;
            });
        },
        fixPic(url, size) {
            return url.replace("w.h", size);
        },
        refresh() {
            this.scroll && this.scroll.refresh();
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
        },
        selectMovie(movie, index) {
            //81.4px是选中海报的宽度
            this.activeIndex = index;
            this.$emit("select-movie", { movie, index });
            this.scrollTo(-81.4 * index, 0, 500);
        }
    },
    watch: {
        posters() {
            this.$nextTick(() => {
                this._initWidth();
                this.scroll.refresh();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.slider {
    @include ct;
    width: 100%;

    .slider-group {
        display: flex;
    }
}
.slider-item {
    margin: 0 7.5px;
    &.active {
        transform: scale(1.2);
        transition: all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1);
        border: 2px solid #fff;
    }
    img {
        width: 65px;
        height: 95px;
    }
}
</style>