<template>
    <div class="box-office">
        <div class="date-nav">
            <span
                class="date-item"
                v-for="(day, index) in days"
                :key="index"
                :class="{'active': dayIndex == index}"
                @click="changeDay(index)"
            >{{day}}</span>
        </div>
        <div v-if="boxInfo.queryDate">
            <div class="query-info">
                <span class="query-Date">{{boxInfo.queryDate}} {{week}}</span>
                <span>
                    {{dayIndex > 1 ? '预售' : '大盘'}}：
                    <span class="total-box">{{boxInfo.totalBoxInfo}}万</span>
                </span>
                <div class="update-info">{{boxInfo.updateInfo}}</div>
            </div>
            <ul class="box-list-title">
                <li class="c1">片名</li>
                <li class="c2">预售票房
                    <div>(万元）</div>
                </li>
                <li class="c3">票房占比</li>
                <li class="c4">排片占比</li>
                <li class="c5">上座率</li>
            </ul>
            <div class="box-office-centent">
                <ul
                    class="office-info"
                    v-for="(item, index) in boxInfo.list"
                    :key="index"
                    @click="selectMovie(item)"
                >
                    <li class="c1">
                        <div class="nm">{{item.movieName}}</div>
                        <span class="day">{{item.releaseInfo}}</span>
                        <span class="office">{{item.sumBoxInfo}}</span>
                    </li>
                    <li class="c2">{{item.boxInfo}}</li>
                    <li class="c3">{{item.boxRate}}</li>
                    <li class="c4">{{item.showRate}}</li>
                    <li class="c5">{{item.avgSeatView}}</li>
                </ul>
            </div>
        </div>
        <transition name="fade">
            <skeleton-box-office v-if="!boxInfo.queryDate"></skeleton-box-office>
        </transition>
        <router-view></router-view>
    </div>
</template>

<script>
import { getBoxOffice } from "/api/getData";
import { Time, weekDay } from "/common/util";
import SkeletonBoxOffice from "/components/skeleton/SkeletonBoxOffice";
export default {
    data() {
        return {
            boxInfo: {},
            days: ["昨天", "今天", "明天"],
            dayIndex: 1
        };
    },
    created() {
        getBoxOffice().then(res => {
            this.boxInfo = res.data.data;
        });
    },
    components: {
        SkeletonBoxOffice
    },
    computed: {
        week() {
            const day = new Date().getDay() + (this.dayIndex - 1);
            if (this.dayIndex == 1) {
                return "今天";
            } else {
                return weekDay(day);
            }
        }
    },
    methods: {
        changeDay(index) {
            this.dayIndex = index;
            const beginDate = Time.getFormatTime(
                new Date().getTime() +
                    24 * 60 * 60 * 1000 * (this.dayIndex - 1),
                "yyyyMMdd"
            );
            getBoxOffice(beginDate).then(res => {
                this.boxInfo = res.data.data;
            });
        },
        selectMovie(movie) {
            this.$router.push({ path: `/movieDetail/${movie.movieId}` });
            this.$route.meta.headerNavTitle = movie.movieName;
        }
    }
};
</script>

<style lang="scss" scoped>
.box-office {
    margin: 51px 0;
}
.date-nav {
    height: 40px;
    line-height: 40px;
    background-color: #f4f4f4;
    padding: 3px 10px;
    .date-item {
        margin-right: 5px;
        padding: 5px 18px;
        color: #999;
        font-size: 13px;

        &.active {
            border-radius: 3px;
            background-color: $themeColor;
            color: #fff;
        }
    }
}
.query-info {
    color: #333;
    padding: 10px 0 5px 15px;
    .total-box {
        color: $themeColor;
        font-weight: 600;
        font-size: 18px;
    }
    .update-info {
        color: #999;
        padding: 10px 0;
        font-size: 12px;
    }
}
.box-list-title {
    background-color: #ff7f7f;
    color: #fff;
    font-size: 12px;
    padding: 5px 8px;
    display: flex;
    align-items: center;

    .c1 {
        width: 34%;
    }
    .c2,
    .c3,
    .c4,
    .c5 {
        width: 16.5%;
        text-align: center;
        line-height: 18px;
    }
    .c3,
    .c4,
    .c5 {
        margin-left: 15px;
    }
}
.box-office-centent {
    .office-info {
        padding: 8px 5px;
        font-size: 12px;
        display: flex;
        align-items: center;
        .c1 {
            width: 32%;
            text-align: left;
            padding-left: 5px;
            .nm {
                color: #333;
                margin-bottom: 8px;
                font-weight: 777;
                @include ellipsis;
            }
            .day,
            .office {
                color: #999;
                &.office {
                    padding-left: 5px;
                }
            }
        }
        .c2,
        .c3,
        .c4,
        .c5 {
            width: 16.5%;

            &.c2 {
                color: #ff7f7f;
                padding-left: 10px;
            }
            &.c3,
            &.c4 {
                text-align: center;
            }
            &.c5 {
                text-align: right;
                padding-right: 20px;
            }
        }
        &.office-info:nth-child(even) {
            background-color: #f6f6f6;
        }
    }
}
</style>