<template>
    <div class="top-bar">
        <div class="city-enty">
            <span
                class="city-enty-name"
                @click="$router.push('/city')"
            >{{$store.state.currentCity.nm || '正在定位'}}</span>
            <span class="city-enty-arrow"></span>
        </div>
        <slot name="search-input"></slot>
        <slot name="tab-switch"></slot>
    </div>
</template>

<script>
import IconSvg from "./IconSvg";
export default {
    name: "TopBar",
    data() {
        return {};
    },
    computed: {},
    components: {
        IconSvg
    }
};
</script>

<style lang="scss" scoped>
.top-bar {
    position: fixed;
    top: 51px;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    background-color: #fff;
    border-bottom: 0.5px solid #e6e6e6;
    z-index: 5;

    .city-enty {
        display: flex;
        align-items: center;
        padding-left: 15px;

        .city-enty-name {
            max-width: 19.2vw;
            font-size: 15px;
            @include ellipsis;
        }

        .city-enty-arrow {
            @include triangle(down, -2px, 4px, #b0b0b0, 4px);
        }
    }
}
</style>