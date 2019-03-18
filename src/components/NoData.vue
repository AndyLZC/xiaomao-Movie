<template>
    <div class="no-result">
        <img src="/xiamo/img/nothing.png" alt>
        <p class="nothing-text">{{text}}</p>
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: ""
        }
    }
};
</script>

<style lang="scss" scoped>
.no-result {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: #fff;

    img {
        width: 87px;
        height: 100px;
        margin-bottom: 16px;
    }

    .nothing-text {
        color: #999;
        font-size: 16px;
        font-style: italic;
    }
}
</style>