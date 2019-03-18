<template>
    <transition name="right">
        <div class="buy-record">
            <div
                class="record-item"
                v-for="item in tickeys"
                :key="item.orderId"
                @click="selectMovie(item)"
            >
                <div class="text"></div>
                <div class="buy-info">
                    <div class="nm">{{item.seatData.movie.movieName}}</div>
                    <div class="show-time">
                        {{item.seatData.show.showDate}}
                        {{item.seatData.show.showTime}}
                        {{item.seatData.show.lang}}
                        {{item.seatData.show.dim}}
                    </div>
                    <div
                        class="address"
                    >{{item.seatData.cinema.cinemaName}} {{item.seatData.hall.hallName}}</div>
                    <span
                        class="seat"
                        v-for="(seat, index) in item.seatList"
                        :key="index"
                    >{{seat.rowId}}排{{seat.seat.columnId}}座</span>
                    <div class="orderId">
                        订单编号:
                        <span class="order-text">{{item.orderId}}</span>
                    </div>
                </div>
                <img class="movie-poster" :src="picFix(item.seatData.img)" alt="poster">
            </div>
            <no-data class="no-data" text="暂无购买记录，去买一张影票吧" v-if="!tickeys.length"></no-data>
        </div>
    </transition>
</template>

<script>
import { mapState } from "vuex";
import NoData from "/components/NoData";

export default {
    data() {
        return {
            buyRecord: []
        };
    },
    computed: {
        ...mapState(["tickeys"])
    },
    components: {
        NoData
    },
    methods: {
        picFix(wh) {
            return wh.replace("w.h", "148.220");
        },
        selectMovie(item) {
            this.$router.push({
                path: `/movieDetail/${item.seatData.movie.movieId}`
            });
            this.$route.meta.headerNavTitle = item.seatData.movie.movieName;
        }
    }
};
</script>
<style lang="scss" scoped>
.buy-record {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 99999;
    background-color: #fff;
    .record-item {
        display: flex;
        margin: 10px;
        border-radius: 3px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
        .text {
            position: relative;
            flex: 0 0 30px;
            border-right: 1px dashed #f1f1f1;
            &::before,
            &::after {
                content: "";
                display: block;
                position: absolute;
                @include wh(12px, 6px);
                right: -6px;
                background-color: #f8f8f8;
            }

            &::before {
                top: 0;
                border-radius: 0 0 12px 12px;
            }

            &::after {
                bottom: 0;
                border-radius: 12px 12px 0 0;
            }
        }
        .movie-poster {
            margin: 10px;
            flex: 0 1 65px;
            height: 90px;
            border-radius: 3px;
            background-color: #999;
        }
        .buy-info {
            flex: 1;
            padding: 10px;
            font-size: 12px;
            color: #666;
            line-height: 17px;
            max-width: 200px;
            .nm {
                color: #000;
                font-size: 18px;
                margin-bottom: 8px;
                @include ellipsis;
            }
            .address {
                @include ellipsis;
            }
            .seat,
            .orderId {
                color: #b1b1b1;
                margin-right: 5px;
            }
            .order-text {
                color: #333;
            }
        }
    }
}
</style>