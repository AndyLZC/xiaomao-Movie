<template>
    <div class="cinema-detail" v-if="movies.length">
        <div class="cinema-address">
            <div class="cinema-info">
                <p class="cinema-name">{{cinemaData.nm}}</p>
                <p class="address-detail">{{cinemaData.addr}}</p>
            </div>
            <div class="map-icon">
                <icon-svg name="location-city" width="20" height="20"></icon-svg>
            </div>
        </div>

        <div class="cinema-block">
            <div class="movie-bg" :style="{'background-image': `url(${bgImg})`} "></div>
            <div class="bg-filter"></div>
            <poster-comp :posters="movies" v-if="movies.length" @select-movie="selectMovie($event)"></poster-comp>
        </div>
        <div class="movie-info">
            <div class="movie-name">
                <span>{{movies[movieIndex].nm}}</span>
                <span class="score-wish" v-if="movies[movieIndex].sc !== '0.0' ">
                    {{movies[movieIndex].sc}}
                    <span class="score-text">分</span>
                </span>
                <span class="score-wish" v-else>
                    {{movies[movieIndex].wish}}
                    <span class="score-text">人想看</span>
                </span>
            </div>
            <div class="movie-desc">{{movies[movieIndex].desc}}</div>
        </div>
        <div class="day-wrap">
            <ul class="day-list">
                <li
                    :class="['day-item',{'active': showIndex == index}]"
                    v-for="(item, index) in movies[movieIndex].shows"
                    :key="index"
                    @click="selectDate(index)"
                >{{item.dateShow}}</li>
            </ul>
        </div>
        <div class="seat-wrap">
            <div class="discount-label" v-if="vipInfo.tag">
                <span class="label">{{vipInfo.tag}}</span>
                <span class="desc">{{vipInfo.title}}</span>
                <span class="limit">{{vipInfo.process}}</span>
            </div>
            <ul class="seat-list" v-if="movies.length">
                <li
                    class="seat-info"
                    v-for="(item, index) in plist"
                    :key="index"
                    @click="selectSeat(item)"
                >
                    <div class="time-box">
                        <div class="begin-time">{{item.tm}}</div>
                        <div class="end-time">{{endTime(item)}} 散场</div>
                    </div>
                    <div class="info-box">
                        <div class="tag">{{item.lang}} {{item.tp}}</div>
                        <div class="hall">{{item.th}}</div>
                    </div>
                    <div class="price-box">
                        <div class="sell-price">{{1}}元</div>
                        <div class="discount-wrap" v-if="item.extraDesc">
                            <span class="discount">{{item.extraDesc}}</span>
                            <span class="discount-price">{{item.vipPrice}}</span>
                        </div>
                    </div>
                    <div class="btn-wrap">
                        <div class="tickey-btn">{{'购票'}}</div>
                    </div>
                </li>
            </ul>
            <div class="no-seat-wrap" v-show="!plist.length">
                <div>
                    <img src="/img/no-seat.png" alt width="100px">
                    <div>暂无场次</div>
                </div>
            </div>
        </div>
        <div class="set-meal">
            <p class="title">超值套餐</p>
            <div class="meal-list" v-for="item in divideDealList" :key="item.titleId">
                <p class="meal-type">{{item.title}}</p>
                <meal-item
                    v-for="(deal, index) in item.dealList"
                    :key="index"
                    :deal="deal"
                    @click.native="buyMeal(deal)"
                ></meal-item>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { getCinemaDetail, getSeatPlan } from "/api/getData";
import { Time } from "/common/util";
import Slider from "/components/Slider";
import MealItem from "./MealItem";
import { mapMutations } from "vuex";
import PosterComp from "./PosterComp";
export default {
    props: ["id"],
    data() {
        return {
            dealList: [],
            cinemaData: {},
            vipInfo: {},
            divideDealList: [],
            movies: [],
            movieIndex: 0,
            showIndex: 0,
            cinemaData: [],
            prvId: "",
            imgUrl: ""
        };
    },
    computed: {
        bgImg() {
            return this.movies[this.movieIndex].img.replace("w.h", "148.219");
        }
    },
    activated() {
        if (this.prvId == this.id) return;
        this.prvId = this.id;
        this._getCinemaDetail();
    },
    components: {
        Slider,
        MealItem,
        PosterComp
    },
    methods: {
        _getCinemaDetail() {
            this.$loading.show();
            getCinemaDetail(this.id).then(res => {
                this.$loading.hide();
                this.divideDealList = res.data.dealList.divideDealList;
                this.cinemaData = res.data.cinemaData;
                this.movies = res.data.showData.movies;
                this.plist = this.movies[0].shows[0].plist;
                this.vipInfo = res.data.showData.vipInfo[0];
                this.imgUrl = this.movies[0].img;
            });
        },
        selectMovie(options) {
            //保存当前电影的海报图片，用于购买记录展示
            this.imgUrl = options.movie.img;
            if (this.movieIndex == options.index) {
                this.$router.push({ path: `/movieDetail/${options.movie.id}` });
                this.$route.meta.headerNavTitle = options.movie.nm;
            }
            this.movieIndex = options.index;
            this.selectDate(0);
        },
        selectSeat(movie) {
            movie.img = this.imgUrl;
            this.$router.push({
                path: `/cinemaSeat/${movie.seqNo}`,
                query: { movie }
            });
        },
        selectDate(index) {
            this.showIndex = index;
            this.plist = this.movies[this.movieIndex].shows[index].plist;
        },
        endTime(item) {
            let time = new Date(`${item.dt} ${item.tm}`);
            time = time.setMinutes(time.getMinutes() + this.movies[0].dur);
            return Time.getFormatTime(new Date(time), "hh:mm");
        },
        fixPic(url, size) {
            return url.replace("w.h", size);
        },
        buyMeal(deal) {
            this.$router.push({
                path: `/mealOrder/${deal.dealId}`,
                query: { deal }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.cinema-detail {
    position: fixed;
    top: 51px;
    bottom: 0;
    width: 100%;
    z-index: 5;
    background-color: #f1f1f1;
    overflow: scroll;
    .cinema-address {
        position: relative;
        align-items: center;
        padding: 10px;
        background-color: #fff;
        .cinema-info {
            position: relative;
            width: 70%;
            padding-right: 25px;

            .cinema-name {
                line-height: 24px;
                font-size: 17px;
                color: #333;
                font-weight: 700;
                @include ellipsis;
            }
            .address-detail {
                margin-top: 2px;
                font-size: 13px;
                color: #999;
                @include ellipsis;
            }
        }
        .map-icon {
            width: 70px;
            @include ct;
            line-height: 32px;
            border-left: 1px solid #d8d8d8;
            right: 0px;
            text-align: center;
        }
    }
    .cinema-block {
        position: relative;
        padding: 12px 0;
        overflow: hidden;
        z-index: 1;
        height: 120px;
        .movie-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            overflow: hidden;
            filter: blur(30px);
            background-position-y: 40%;
        }
        .bg-filter {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: #040404;
            opacity: 0.35;
        }
    }
    .movie-info {
        padding: 15px 0 10px 0;
        border-bottom: 1px solid #f1f1f1;
        text-align: center;
        background-color: #fff;

        .movie-name {
            margin-bottom: 4px;
            font-weight: 700;
            font-size: 17px;
            color: #000;
            .score-wish {
                margin-left: 5px;
                color: #ffb400;
                .score-text {
                    font-size: 12px;
                    font-weight: 400;
                }
            }
        }
        .movie-desc {
            color: #999;
            font-size: 13px;
        }
    }
    .day-wrap {
        border-bottom: 1px solid #f1f1f1;
        line-height: 45px;
        color: #666;
        font-size: 14px;
        background-color: #fff;
        .day-list {
            width: 100%;
            overflow-x: scroll;
            @include no-scrollbar;
            white-space: nowrap;
            .day-item {
                display: inline-block;
                margin: 0 15px;
                &.active {
                    color: $themeColor;
                    border-bottom: 2px solid $themeColor;
                }
            }
        }
    }
    .seat-wrap {
        position: relative;
        background-color: #f1f1f1;
        .discount-label {
            line-height: 42px;
            padding: 0 15px;
            font-size: 12px;
            background-color: #fff5ea;
            .label {
                padding: 0 4px;
                background-color: #f90;
                color: #fff;
                border-radius: 2px;
            }
            .desc {
                margin-left: 5px;
                color: #f90;
                font-size: 12px;
            }
            .limit {
                float: right;
                color: #999;
            }
        }
        .seat-list {
            position: relative;
            z-index: 99;
            background-color: #fff;
            .seat-info {
                display: flex;
                margin: 0 13px;
                padding: 17px 2px 17px 0;
                color: #333;
                border-bottom: 1px solid #f1f1f1;

                .time-box {
                    .begin-time {
                        font-size: 20px;
                    }
                    .end-time {
                        margin-top: 10px;
                        font-size: 12px;
                        color: #999;
                    }
                }
                .info-box {
                    flex: 1;
                    margin-left: 17px;
                    font-size: 12px;
                    .tag {
                        line-height: 18px;
                        font-size: 13px;
                    }
                    .hall {
                        margin-top: 12px;
                        color: #999;
                    }
                }
                .price-box {
                    flex: 0 1 120px;
                    margin-right: 15px;
                    color: $themeColor;
                    text-align: right;
                    font-size: 0;
                    .sell-price {
                        font-size: 17px;
                    }
                    .discount-wrap {
                        display: inline-block;
                        margin-top: 8px;
                        margin-right: -5px;
                        border: 1px solid #f90;
                        border-radius: 2px;
                        font-size: 12px;
                        //transform: scale(0.8);
                        .discount {
                            padding: 0 2px;
                            color: #fff;
                            background-color: #f90;
                        }
                        .discount-price {
                            padding: 0 2px;
                            color: #f90;
                        }
                    }
                }
                .btn-wrap {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    .tickey-btn {
                        width: 47px;
                        height: 24px;
                        line-height: 24px;
                        color: $themeColor;
                        text-align: center;
                        font-size: 12px;
                        border-radius: 12px;
                        border: 1px solid $themeColor;
                    }
                }
            }
        }
        .no-seat-wrap {
            height: 200px;
            line-height: 34px;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
    }
    .set-meal {
        margin-top: 10px;
        padding: 10px 10px 0 10px;
        background-color: #fff;
        .title {
            padding-left: 10px;
            line-height: 45px;
            font-weight: 700;
            color: #000;
            border-bottom: 1px solid #f1f1f1;
        }
        .meal-list {
            background-color: #fff;
            .meal-type {
                padding: 10px;
                font-size: 16px;
                color: #333;
            }
        }
    }
}
</style>