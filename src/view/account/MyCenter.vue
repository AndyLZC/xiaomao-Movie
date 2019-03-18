<template>
    <div class="my-center">
        <div class="bg">
            <img src="/xiamo/img/avatar.png" alt class="avatar">
        </div>

        <div class="group">
            <div class="my-fav" @click="$router.push('/MyFavorite')">
                <icon-svg name="fav" width="20" height="20" class="icon"></icon-svg>我的电影
            </div>
            <div class="buy-record" @click="$router.push('/BuyRecord')">
                <icon-svg name="buy" width="20" height="20" class="icon"></icon-svg>购买记录
            </div>
            <div class="about-me">
                <icon-svg name="about-me" width="20" height="20" class="icon"></icon-svg>
                <a href="https://juejin.im/post/5c8f43b7e51d4550534405f7">关于项目</a>
            </div>
        </div>

        <div class="logout" @click="handleLogOut">退出登陆</div>
        <router-view></router-view>
    </div>
</template>

<script>
import { removeStore } from "/common/util";
import IconSvg from "/components/IconSvg";
import { mapMutations } from "vuex";
export default {
    data() {
        return {};
    },
    components: {
        IconSvg
    },
    methods: {
        ...mapMutations(["SAVE_FAVORITE", "SAVE_TICKEY"]),
        handleLogOut() {
            this.$alert({
                msg: "退出将清除所有历史记录！"
            }).then(res => {
                if (res === "confirm") {
                    removeStore("movie-token");
                    removeStore("historyList");
                    removeStore("movies");
                    removeStore("tickeys");
                    this.SAVE_FAVORITE([]);
                    this.SAVE_TICKEY([]);
                    this.$router.push("/movie");
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.my-center {
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
    background-color: #f1f1f1;
    .bg {
        height: 150px;
        @include bgi-full("/xiaomao/img/bg.png");
        text-align: center;

        .avatar {
            width: 70px;
            border-radius: 70px;
            margin-top: 30px;
            border: 3px solid #fff;
        }
    }

    .group {
        margin-top: -20px;
        background-color: #fff;
        padding: 0px 10px;
        border-radius: 15px 15px 0 0;

        .my-fav,
        .buy-record,
        .order,
        .about-me {
            position: relative;
            line-height: 44px;
            border-bottom: 1px solid #f1f1f1;
            font-size: 15px;
            .icon {
                margin: -2px 5px;
            }
            &::after {
                position: absolute;
                right: 15px;
                top: 18px;
                display: inline-block;
                content: "";
                width: 8px;
                height: 8px;
                border-left: 1px solid #ccc;
                border-top: 1px solid #ccc;
                transform: rotate(135deg);
            }
        }
    }

    .logout {
        width: 50%;
        margin: auto;
        line-height: 40px;
        border-radius: 4px;
        background-color: $themeColor;
        color: #fff;
        text-align: center;
        @include cl;
        bottom: 100px;
    }
}
</style>