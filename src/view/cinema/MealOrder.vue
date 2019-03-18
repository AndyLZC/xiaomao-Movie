<template>
    <transition name="right">
        <div class="meal-order">
            <meal-item :deal="$route.query.deal"></meal-item>
            <div class="meal-count">
                <span class="title">数量</span>
                <div class="count-btn">
                    <span class="dec" @click="dec()">-</span>
                    <span>{{num}}</span>
                    <span class="add" @click="add()">+</span>
                </div>
            </div>
            <div class="coupon">
                <span class="title">抵用券</span>
                <span class="coupon-count">无可用</span>
            </div>
            <div class="tip">
                <div class="title">购买须知</div>
                <div class="content">
                    <p>有效期</p>2018.04.03 至 2037.12.31（周末、法定节假日通用）
                    <p>使用时间</p>抵用券使用时间：10:00-22:00
                    <p>温馨提示</p>特殊节假日期间，卖品兑换规则以影城公示为主
                    <p>其他</p>消费者不可同时享受商家其他优惠
                </div>
            </div>
            <div class="bill-wrap">
                <span class="refund">
                    <icon-svg name="refund"></icon-svg>
                    <span class="desc">随时退</span>
                </span>
                <span class="refund">
                    <icon-svg name="refund"></icon-svg>
                    <span class="desc">过期退</span>
                </span>
                <span class="total-cost">
                    小计
                    <span class="yuan">{{totalPay}}元</span>
                </span>
                <div class="confirm-btn" @click="confirmPay">确认支付</div>
            </div>
        </div>
    </transition>
</template>

<script>
import MealItem from "./MealItem";
import IconSvg from "/components/IconSvg";
export default {
    props: {},
    data() {
        return {
            num: 1
        };
    },
    created() {
        console.log(this.$route.query.deal);
        let item = [];
        item = this.$route.query.deal.title.split("+");
    },
    components: {
        MealItem,
        IconSvg
    },
    computed: {
        totalPay() {
            return (this.num * this.$route.query.deal.price).toFixed(2);
        }
    },
    methods: {
        dec() {
            if (this.num < 2) {
                return;
            } else {
                this.num--;
            }
        },
        add() {
            this.num++;
        },
        confirmPay() {
            this.$alert({
                msg: "买张影票支持一下我吧！"
            }).then(res => {
                if (res == "confirm") {
                    this.$toast("支付成功", true);
                    this.$router.go(-1);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.meal-order {
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 100%;
    z-index: 999;
    background-color: #f1f1f1;
    overflow-y: auto;
    overflow-x: hidden;
    .meal-count {
        display: flex;
        align-items: center;
        margin-top: 10px;
        padding: 15px;
        background-color: #fff;

        .count-btn {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            line-height: 28px;
            .dec,
            .add {
                display: inline-block;
                border-radius: 50% 50%;
                line-height: 28px;
                width: 28px;
                height: 28px;
                font-size: 24px;
                font-weight: 500;
                text-align: center;

                &.dec {
                    border: 1px solid #ccc;
                    color: #ccc;
                    margin-right: 10px;
                }
                &.add {
                    margin-left: 10px;
                    background-color: #f80303;
                    color: #fff;
                }
            }
        }
    }
    .coupon {
        padding: 10px 15px;
        line-height: 30px;
        background-color: #fff;
        .title {
            color: #333;
        }
        .coupon-count {
            float: right;
            color: #888;
            font-size: 13px;
        }
    }
    .tip {
        margin-top: 10px;
        margin-bottom: 100px;
        padding: 10px 15px;
        line-height: 30px;
        background-color: #fff;
        .title {
            border-bottom: 1px solid #f1f1f1;
        }
        .content {
            font-size: 13px;
            color: #aaa;

            .param {
                line-height: 30px;
            }
        }
    }
    .bill-wrap {
        position: fixed;
        box-sizing: border-box;
        bottom: 0;
        width: 100%;
        padding: 0px 15px 10px 15px;
        line-height: 42px;
        background-color: #fff;
        font-size: 14px;
        border-top: 1px solid #f1f1f1;
        .refund {
            margin-right: 8px;
            color: #06ba31;
            .desc {
                margin-left: 5px;
            }
        }
        .total-cost {
            float: right;
            color: #333;
            .yuan {
                font-size: 24px;
                color: #f80303;
                font-weight: 500;
            }
        }
        .confirm-btn {
            display: flex;
            width: 100%;
            justify-content: center;
            line-height: 45px;
            background-color: #fec000;
            border-radius: 5px;
            color: #fff;
        }
    }
}
</style>