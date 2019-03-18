<template>
    <transition>
        <div class="alert-wrapper" v-if="visible">
            <div class="alert-box">
                <p class="alert-title">{{msg}}</p>
                <div class="alert-btn">
                    <span
                        class="cancel-btn"
                        @click="handelAction('cancel')"
                        v-if="showCancelBtn"
                    >{{cancelBtnText}}</span>
                    <span
                        class="comfirm-btn"
                        @click="handelAction('confirm')"
                        v-if="showConfirmBtn"
                    >{{confirmBtnText}}</span>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    data() {
        return {
            visible: false
        };
    },
    props: {
        msg: String,
        showConfirmBtn: {
            type: Boolean,
            default: true
        },
        showCancelBtn: {
            type: Boolean,
            default: true
        },
        confirmBtnText: {
            type: String,
            default: "确认"
        },
        cancelBtnText: {
            type: String,
            default: "取消"
        },
        callback: Function
    },
    methods: {
        handelAction(action) {
            this.callback && this.callback(action);
        }
    }
};
</script>
<style lang='scss' scoped>
.v-enter-active,
.v-leave-active {
    opacity: 1;
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.v-enter,
.v-leave-to {
    opacity: 0;
}

.alert-wrapper {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.3);
}

.alert-box {
    background-color: #fff;
    line-height: 22px;
    border-radius: 6px;
    text-align: center;
    color: #777;
    font-size: 16px;
    max-width: 80%;
    min-width: 70%;
    animation: confirm-zoom 0.3s cubic-bezier(0.55, 0, 0.1, 1);

    .alert-title {
        padding: 25px 25px 20px 25px;
        @include line(bottom);
    }
}

.alert-btn {
    padding: 15px;
    line-height: 20px;
    display: flex;

    .cancel-btn,
    .comfirm-btn {
        font-size: 16px;
        text-align: center;
        flex: 1;
    }

    .cancel-btn {
        color: #444;
        font-weight: 500;
        @include line(right);
    }

    .comfirm-btn {
        font-weight: 600;
        color: $themeColor;
        @include ellipsis;
    }
}
@keyframes confirm-fadein {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes confirm-zoom {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>
