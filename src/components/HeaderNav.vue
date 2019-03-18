<template>
    <div class="header-nav">
        <icon-svg
            v-show="!$route.meta.hideBackArrow"
            class="icon-back"
            fill="#ffffff"
            name="back"
            width="28"
            height="28"
            @click.native="goBack()"
        ></icon-svg>
        <h1 class="header-title">{{this.$route.meta.headerNavTitle || '小猫电影'}}</h1>
    </div>
</template>

<script>
import IconSvg from "./IconSvg";
export default {
    name: "HeaderNav",
    components: {
        IconSvg
    },
    data() {
        return {
            title: "小猫电影"
        };
    },
    props: {
        msg: {
            type: String
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
            //this.$loading.hide();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 51px;
    display: flex;
    align-items: center;
    line-height: 51px;
    background-color: $themeColor;
    color: #fff;
    z-index: 6;

    .icon-back {
        @include ct;
        margin-left: 15px;
    }

    .header-title {
        flex: 1;
        margin: 0 70px;
        text-align: center;
        font-size: 18px;
        @include ellipsis;
    }
    .input-wrap {
        flex: 1;
        box-sizing: border-box;
        padding: 0px 10px;
        margin-left: 15px;
        margin-right: 15px;
        max-width: 78%;
        line-height: 26px;
        height: 26px;
        border-radius: 16px;
        background-color: #fff;
        .search-input {
            padding: 0 5px;
            margin-left: 3px;
            color: $themeColor;
            font-size: 12px;
            -webkit-text-fill-color: #b1b1b1;
        }
    }
    .cancle {
        margin-right: 15px;
    }
}
</style>
