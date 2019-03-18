<template>
    <div class="login">
        <div class="input-box">
            <div class="passport">
                <input type="text" placeholder="账号随意">
            </div>
            <div class="pwd">
                <input type="text" placeholder="密码随意">
            </div>
            <div class="login-btn" @click="handleLogin">登陆</div>
        </div>
    </div>
</template>

<script>
import IconSvg from "/components/IconSvg";
import { setStore } from "/common/util";
export default {
    data() {
        return {};
    },
    components: {
        IconSvg
    },
    methods: {
        handleLogin() {
            //模拟登陆
            this.$loading.show();
            setTimeout(() => {
                this.$loading.hide();
                this.$toast("登陆成功");
                setStore("movie-token", 1);
                this.$router.push(this.$route.query.redirect || "/");
            }, 1200);
        }
    }
};
</script>

<style lang="scss" scoped>
.login {
    margin-top: 51px;
    .input-box {
        padding: 30px;
        .passport,
        .pwd {
            margin-bottom: 40px;
            border-bottom: 1px solid #f1f1f1;
            padding: 5px 0;

            input {
                color: $themeColor;
                font-size: 17px;
                -webkit-text-fill-color: #999;
            }
        }
    }
    .login-btn {
        margin-top: 30px;
        line-height: 40px;
        background-color: $themeColor;
        text-align: center;
        color: #fff;
        font-size: 18px;
        border-radius: 5px;
    }
}
</style>