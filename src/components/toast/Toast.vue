<template>
    <transition name="fade">
        <div class="toast" v-if="visible">
            {{msg}}
            <icon-svg name="pay-success" class="pay-success" v-if="pay"></icon-svg>
        </div>
    </transition>
</template>
<script>
export default {
    data() {
        return {
            msg: "",
            visible: false,
            pay: false
        };
    }
};
</script>
<style lang="scss" scoped>
.toast {
    @include center;
    padding: 10px 15px;
    z-index: 99999;
    max-width: 65%;
    min-width: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    line-height: 20px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    font-weight: 700px;

    .pay-success {
        margin-left: 5px;
    }
}
</style>
