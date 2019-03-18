<template>
    <div class="seats">
        <section class="movie-info-wrap" v-if="seatData.show">
            <div class="movie-info">
                <p class="nm">{{seatData.movie.movieName}}</p>
                <span class="time">
                    {{seatData.show.showDate}}
                    {{seatData.show.showTime}}
                    {{seatData.show.lang}}
                    {{seatData.show.dim}}
                </span>
            </div>
            <ul class="notice-list" v-if="seatData.reminder.notice">
                <li
                    class="notice-item"
                    v-for="(item,index) of seatData.reminder.notice"
                    :key="index"
                >
                    <img :src="item.imgUrl" width="20px" height="20px">
                    {{item.detail}}
                </li>
            </ul>
        </section>
        <section class="seat-block" v-if="seatData.hall" @click="changeScale()" ref="seatBlock">
            <div class="hall-name-wrap">
                <div class="row-nav" ref="navBar">
                    <div v-for="seat of seats.length" :key="seat">{{seat}}</div>
                </div>
                <div class="seats-list" ref="seatGroup">
                    <span class="hall-name" ref="hall">{{seatData.hall.hallName}}银幕</span>
                    <div class="center-line" ref="line"></div>
                    <div class="seats-wrap" ref="seatWrap">
                        <ul v-for="(row, rowIndex) of seats " :key="rowIndex" class="row">
                            <li
                                v-for="(seat, index) of row.columns"
                                :key="index"
                                @click.stop="selectSeat(row.rowId, seat, index)"
                                :class="['column',{'active': true}]"
                                :style="{'background-image': `url(/xiaomao/img/${seat.st}.png)`}"
                            ></li>
                        </ul>
                    </div>
                    <div class="seat-type-info">
                        <span class="seat-type">
                            <img src="/img/N.png" alt>可选
                        </span>
                        <span class="seat-type">
                            <img src="/img/S.png" alt>已选
                        </span>
                        <span class="seat-type">
                            <img src="/img/LK.png" alt>不可选
                        </span>
                        <span class="seat-type">
                            <img src="/img/R.png" alt>情侣座
                        </span>
                    </div>
                </div>
            </div>
        </section>
        <section class="buy-block">
            <span class="title" v-show="seatList.length">已选座位</span>
            <ul class="seat-list">
                <li
                    class="seat-item"
                    v-for="(item, index) of seatList"
                    :key="index"
                    @click="deleteSeat(item)"
                >
                    <p class="seleted-seat-info">{{item.rowId}}排 {{item.seat.columnId}}座</p>
                    <p class="price">1元</p>
                    <icon-svg
                        name="close"
                        width="10"
                        height="10"
                        fill="#b1b1b1"
                        class="delete-icon"
                    ></icon-svg>
                </li>
            </ul>
            <ul class="recommend-list" v-show="!seatList.length && bestRecommend.bestOne">
                <span>推荐座位</span>
                <li
                    class="recommend-item"
                    v-for="index in 5"
                    :key="index"
                    @click="recommend(index)"
                >{{index}} 人</li>
            </ul>
            <div
                class="order-btn"
                @click="confirmOrder()"
                :style="{'background-color': seatList.length ? '#f90' : '#ffddb2'}"
            >
                <span class="total-price" v-show="seatList.length">¥{{seatList.length}}</span>
                <span>{{seatList.length ? '确认选座' : '请先选座'}}</span>
            </div>
        </section>
        <router-view></router-view>
    </div>
</template>

<script>
import { getSeatPlan } from "/api/getData";
import { mapState } from "vuex";
const SEAT_SIZE = 26;
export default {
    data() {
        return {
            seatData: {},
            seats: [],
            count: 0,
            bestRecommend: {},
            bestSeats: [],
            seatList: [],
            maxLen: 0
        };
    },
    created() {
        this.$loading.show();
        this._getSeatData();
    },
    computed: {
        ...mapState(["currentCity"])
    },
    methods: {
        _getSeatData() {
            getSeatPlan(
                this.currentCity.id,
                this.$route.query.movie.seqNo
            ).then(res => {
                this.$loading.hide();
                if (!res.data.seatData.seat) {
                    //当天没有场次
                    this.$toast(res.data.seatError.message);
                    this.$router.go(-1);
                    return;
                }
                this.seats = res.data.seatData.seat.sections[0].seats;
                this.seatData = res.data.seatData;
                this.seatData.img = this.$route.query.movie.img;
                //可能会没有推荐座位的情况
                if (this.seatData.seat.bestRecommendation) {
                    this.bestRecommend = this.seatData.seat.bestRecommendation;
                }
                this._initWidth();
            });
        },
        _initWidth() {
            const len = [];
            for (let item of this.seats) {
                len.push(item.columns.length);
            }
            //获取最大列数
            this.maxLen = Math.max(...len);
            this.$nextTick(() => {
                this.$refs.seatGroup.style.width =
                    this.maxLen * SEAT_SIZE + "px";
                //虚线居中
                this.$refs.line.style.left =
                    0.5 * this.maxLen * SEAT_SIZE + "px";
            });
        },
        selectSeat(rowId, seat, columnIndex) {
            // E: 非座位 LK: 被锁的座位 N：可选座位  S: 已选座位  L：左边座位 R: 右边座位 love: 选中情侣座
            let lSeat = this.seats[rowId - 1].columns[columnIndex - 1];
            let rSeat = this.seats[rowId - 1].columns[columnIndex + 1];
            if (seat.st == "LK" || seat.st == "E") return;
            if (seat.st == "N" || seat.st == "R" || seat.st == "L") {
                //情侣座
                if (this.seatList.length == 4 && seat.st != "N") {
                    this.$toast("一次最多选择5个座位");
                    return;
                }
                //非情侣座
                if (this.seatList.length >= 5) {
                    this.$toast("一次最多选择5个座位");
                    return;
                }
                this.seatList.unshift({ rowId, seat, columnIndex });
                //情侣座，如果选右边的座位
                if (seat.st == "R") {
                    seat.st = "love";
                    lSeat.st = "love";
                    this.seatList.unshift({
                        rowId,
                        seat: lSeat,
                        columnIndex: columnIndex - 1
                    });
                    //情侣座，如果选左边的座位
                } else if (seat.st == "L") {
                    seat.st = "love";
                    rSeat.st = "love";
                    this.seatList.unshift({
                        rowId,
                        seat: rSeat,
                        columnIndex: columnIndex + 1
                    });
                } else {
                    seat.st = "S";
                }
                this.$refs.seatWrap.style.transform = `scale(1.1)`;
                this.$refs.navBar.style.transform = `scale(1.1)`;
            } else {
                //取消座位
                let index = this.seatList.findIndex(item => {
                    return (
                        item.rowId == rowId &&
                        item.seat.columnId == seat.columnId
                    );
                });
                // //处理非情侣座的情况
                if (seat.st == "S") {
                    seat.st = "N";
                    this.seatList.splice(index, 1);
                    return;
                }
                //处理情侣座的情况
                if (columnIndex % 2 == 1) {
                    lSeat.st = "L";
                    seat.st = "R";
                } else {
                    rSeat.st = "R";
                    seat.st = "L";
                }
                if (index >= 2) {
                    this.seatList.splice(2, 2);
                } else {
                    this.seatList.splice(0, 2);
                }
            }
        },
        deleteSeat(item) {
            this.selectSeat(item.rowId, item.seat, item.columnIndex);
        },
        recommend(index) {
            //情侣座没有推荐座位
            const map = {
                1: "bestOne",
                2: "bestTwo",
                3: "bestThree",
                4: "bestFour",
                5: "bestFive"
            };
            //可能会出现不推荐5个座位的情况
            if (!this.bestRecommend[map[index]]) {
                this.$toast("暂无推荐");
                return;
            }
            let bestSeats = this.bestRecommend[map[index]].seats;
            //重新获取推荐座位前先清空之前已选的
            this.seatList = [];
            this.seats.forEach(row => {
                row.columns.forEach(seat => {
                    if (seat.st != "LK" && seat.st != "E") seat.st = "N";
                });
            });
            //选取对应的推荐座位
            bestSeats.forEach(row => {
                this.seats[row.rowId - 1].columns.forEach((seat, index) => {
                    if (seat.columnId == row.columnId) {
                        seat.st = "S";
                        this.seatList.unshift({
                            rowId: row.rowId,
                            seat,
                            columnIndex: index
                        });
                    }
                });
            });
        },
        changeScale() {
            this.$refs.seatWrap.style.transform = `scale(.8)`;
            this.$refs.navBar.style.transform = `scale(.8)`;
        },
        confirmOrder() {
            if (!this.seatList.length) return;
            //模拟提交订单
            this.$router.push({ path: "/cinemaSeat/payMent" });
        }
    }
};
</script>

<style lang="scss" scoped>
.seats {
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 100%;
    z-index: 999;
    overflow: scroll;
    background-color: #f1f1f1;

    .movie-info-wrap {
        padding: 0 15px;
        background-color: #fff;
        overflow: hidden;
        .movie-info {
            padding: 15px 0;
            line-height: 20px;
            font-size: 12px;
            .nm {
                color: #333;
                font-size: 15px;
                font-weight: 700;
            }
        }
        .notice-list {
            border-top: 1px solid #e7e7e7;
            .notice-item {
                line-height: 30px;
            }
        }
    }

    .seat-block {
        width: 100%;
        overflow: scroll;
        @include no-scrollbar;
        .hall-name-wrap {
            position: relative;
            background-color: #f2f1f6;
            text-align: center;

            .row-nav {
                position: absolute;
                left: 10px;
                color: #fff;
                background-color: rgba(225, 225, 225, 0.8);
                border-radius: 10px;
                width: 15px;
                z-index: 9;
                font-size: 12px;
                line-height: 26px;
                transition: all 0.5s ease-out;
                transform: scale(0.8);
            }
            .seats-list {
                position: relative;
                margin-left: 50px;
                margin-top: 80px;
                .center-line {
                    position: absolute;
                    height: 70%;
                    border-left: 1px dashed #c1c1c1;
                }
                .hall-name {
                    @include cl;
                    top: -80px;
                    padding: 3px 20px;
                    line-height: 30px;
                    background-color: #b1b1b1;
                    color: #777;
                    font-size: 12px;
                    @include ellipsis;
                }
            }
            .seats-wrap {
                text-align: left;
                transition: all 0.5s ease-out;
                transform: scale(0.8);

                .row {
                    .column {
                        display: inline-block;
                        white-space: nowrap;
                        box-sizing: border-box;
                        width: 20px;
                        height: 20px;
                        line-height: 15px;
                        margin: 2px 3px;
                        text-align: center;
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        &.active {
                            background-image: url("/img/S.png");
                        }
                    }
                }
            }
            .seat-type-info {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 50px;
                min-width: 300px;
                line-height: 30px;
                font-size: 12px;
                color: #aaa;

                .seat-type {
                    margin-right: 15px;
                    img {
                        margin-right: 5px;
                        vertical-align: center;
                        width: 20px;
                        height: 20px;
                    }
                }
            }
        }
    }
    .buy-block {
        position: fixed;
        box-sizing: border-box;
        padding: 10px;
        bottom: 0;
        width: 100%;
        background-color: #fff;
        .title {
            line-height: 20px;
            text-align: left;
            line-height: 22px;
        }
        .seat-list {
            .seat-item {
                position: relative;
                display: inline-block;
                margin: 2px 5px;
                width: 83px;
                height: 37px;
                color: #777;
                font-size: 12px;
                text-align: center;
                @include bgi-full("/img/seat.png");
                .seleted-seat-info {
                    padding-top: 8px;
                }
                .price {
                    color: $themeColor;
                }
                .delete-icon {
                    @include ct;
                    right: 5px;
                }
            }
        }
        .recommend-list {
            display: flex;
            align-items: center;
            .recommend-item {
                margin-left: 8px;
                border: 1px solid #d7d7d7;
                padding: 5px 8px;
                border-radius: 3px;
                font-size: 12px;
                color: #666;
            }
        }
        .order-btn {
            margin-top: 10px;
            background-color: #f90;
            border-radius: 5px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            font-size: 20px;
            font-weight: 700;

            .total-price {
                margin-right: 10px;
            }
        }
    }
}
</style>