<template>
    <transition name="fade">
        <div class="pay-order">
            <div class="order-info">
                <div class="remain-time-wrap">
                    <span>订单详情</span>
                    <span class="tickey-count">({{seatList.length}}张电影票)</span>
                    <div class="remain-time">
                        <icon-svg name="record" fill="#ffffff" width="18" height="18" class="icon"></icon-svg>
                        <span class="time">{{remaining}}</span>
                    </div>
                </div>

                <div class="tickey-detail" v-if="seatData.movie">
                    <div class="nm">{{seatData.movie.movieName}}</div>
                    <div>
                        {{seatData.show.showDate}}
                        {{seatData.show.showTime}}
                        {{seatData.show.lang}}
                        {{seatData.show.dim}}
                    </div>
                    <div>{{seatData.cinema.cinemaName}}</div>
                    <span
                        class="seat"
                        v-for="(seat, index) in seatList"
                        :key="index"
                    >{{seat.rowId}}排{{seat.seat.columnId}}座</span>
                </div>

                <div class="group">
                    <div class="item">
                        活动与优惠券
                        <span class="right-text" @click="useCoupon">无可用</span>
                    </div>
                    <div class="item">
                        观影卡
                        <span class="right-text" @click="useCoupon">无可用</span>
                    </div>
                    <div class="item">
                        猫享卡
                        <span class="right-text" @click="useCoupon">去绑卡</span>
                    </div>
                    <div class="price">
                        小计
                        <span class="total-price">{{seatList.length}}元</span>
                    </div>
                </div>
            </div>
            <div class="pay-btn" @click="confirmPay">确认支付</div>
            <div class="pay-SQR">
                <img src="/img/weixin.jpg" alt="微信支付">
                <img src="/img/alipay.jpg" alt="支付宝支付">
            </div>
        </div>
    </transition>
</template>

<script>
import { mapMutations } from "vuex";
import { getRandom } from "/common/util";
import { saveTickey } from "/common/storage";
export default {
    data() {
        return {
            seatData: [],
            seatList: [],
            countNum: 900
        };
    },
    created() {
        //模拟购票
        this.$loading.show();
        setTimeout(() => {
            this.$loading.hide();
            this.seatList = this.$parent.seatList;
            this.seatData = this.$parent.seatData;
        }, 1000);
    },
    mounted() {
        this._remainTime();
    },
    computed: {
        remaining() {
            let minute = parseInt(this.countNum / 60);
            if (minute < 10) {
                minute = "0" + minute;
            }
            let second = parseInt(this.countNum % 60);
            if (second < 10) {
                second = "0" + second;
            }
            return minute + ":" + second;
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        ...mapMutations(["SAVE_TICKEY"]),
        _remainTime() {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.countNum--;
                if (this.countNum == 0) {
                    this.$toast("支付超时");
                    clearInterval(this.timer);
                    this.$router.go(-1);
                }
            }, 1000);
        },
        useCoupon() {
            this.$toast("不打算开通了");
        },
        confirmPay() {
            this.$alert({
                msg: "买张电影票支持一下我吧！"
            }).then(res => {
                if (res == "confirm") {
                    //模拟10位数订单号
                    let orderId = getRandom(1000000000, 9999999999);
                    let tickeys = saveTickey({
                        seatData: this.seatData,
                        seatList: this.seatList,
                        orderId
                    });
                    this.SAVE_TICKEY(tickeys);
                    this.$loading.show();
                    let self = this;
                    setTimeout(() => {
                        this.$toast("购票成功！", true);
                        self.$loading.hide();
                        this.$router.push("/movie");
                    }, 1000);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.pay-order {
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 100%;
    z-index: 9999;
    overflow: scroll;
    background-color: #f1f1f1;

    .order-info {
        background-color: #799db3;

        .remain-time-wrap {
            padding: 15px 0 15px 15px;
            line-height: 20px;
            font-size: 13px;
            color: #fff;
            .tickey-count {
                margin-left: 8px;
                font-size: 16px;
            }
            .remain-time {
                float: right;
                padding-left: 8px;
                width: 70px;
                border-radius: 30px 0 0 30px;
                line-height: 24px;
                background-color: rgba(230, 230, 230, 0.35);
                .icon {
                    margin: -3px 5px;
                }
            }
        }
        .tickey-detail {
            padding: 15px;
            font-size: 13px;
            color: #fff;
            line-height: 18px;
            .nm {
                font-size: 18px;
                padding-bottom: 5px;
            }
            .seat {
                padding-right: 5px;
            }
        }
        .group {
            padding: 0 15px;
            background-color: #fff;
            line-height: 40px;
            font-size: 14px;
            color: #333;
            .item,
            .price {
                position: relative;
                border-top: 1px solid #f1f1f1;
                .right-text {
                    float: right;
                    margin-right: 12px;
                    &::after {
                        position: absolute;
                        right: 0px;
                        top: 16px;
                        display: inline-block;
                        content: "";
                        width: 6px;
                        height: 6px;
                        border-left: 1px solid #666;
                        border-top: 1px solid #666;
                        transform: rotate(135deg);
                    }
                }
                .total-price {
                    float: right;
                    margin-right: 12px;
                    color: #f80303;
                    font-size: 16px;
                }
            }
        }
    }
    .pay-btn {
        margin: 30px 15px 0 15px;
        background-color: #f90;
        line-height: 45px;
        text-align: center;
        border-radius: 5px;
        color: #fff;
    }
    .pay-SQR {
        margin: 30px 0;
        display: flex;
        justify-content: center;

        img {
            margin: 0 20px;
            width: 130px;
            height: 130px;
        }
    }
}
</style>