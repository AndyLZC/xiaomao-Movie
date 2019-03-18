<template>
    <transition name="fade">
        <div class="loading-bg" v-if="visible">
            <icon-svg name="loading" width="34" height="34" class="loading-icon"></icon-svg>
        </div>
    </transition>
</template>
<script>
import IconSvg from "../IconSvg";
export default {
    data() {
        return {
            visible: false
        };
    },
    components: {
        IconSvg
    }
};
</script>
<style lang='scss' scoped>
.loading-bg {
    background-color: rgba(255, 255, 255, 0.9);
    position: fixed;
    width: 100%;
    top: 50px;
    bottom: 0;
    left: 0;
    z-index: 99999;
    .loading-icon {
        position: absolute;
        top: 45%;
        left: 45%;
        animation: rotate 0.8s infinite linear;
    }
}
@keyframes rotate {
    0% {
        transform: rotateZ(0deg);
    }
    100% {
        transform: rotateZ(360deg);
    }
}
</style>
