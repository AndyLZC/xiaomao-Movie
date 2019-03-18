<template>
    <div class="movie-detail">
        <div class="movie-container" v-if="detailMovie.img">
            <div class="movie-bg" :style="{'background-image': `url(${bgImg})`} "></div>
            <div class="movie-filter"></div>
            <div class="movie-info">
                <div @click="$router.push({path:'/movieDetail/moviePlyer', query:{detailMovie}})">
                    <img :src="picFix(detailMovie.img)" class="poster">
                    <i class="play-icon" v-if="detailMovie.videourl"></i>
                </div>
                <div class="info-detail">
                    <p class="zh-nm">{{detailMovie.nm}}</p>
                    <p class="en-nm">{{detailMovie.enm}}</p>
                    <div class="type">
                        <span>{{detailMovie.cat}}</span>
                        <div class="movie-tags">
                            <span class="three-d" v-if="detailMovie.version.indexOf('v3d') > -1">3D</span>
                            <span class="two-d" v-if="detailMovie.version.indexOf('v2d') > -1">2D</span>
                            <span class="IMAX" v-if="detailMovie.version.indexOf('imax') > -1">IMAX</span>
                        </div>
                    </div>
                    <div class>
                        <span>{{detailMovie.src}}</span>
                        <span v-if="detailMovie.dur">/ {{detailMovie.dur}}分钟</span>
                    </div>
                    <div class="show-time">{{detailMovie.pubDesc}}</div>
                    <div class="want" v-if="detailMovie.wish">
                        <span>
                            <span class="want-s">{{detailMovie.wish}}</span>
                            人想看
                        </span>
                    </div>
                </div>
            </div>

            <div class="score-wrap" v-if="detailMovie.sc">
                <div class="koubei-score">
                    <div class="koubei">
                        <div class="maoyan-bg">
                            <img src="/img/maoyan.png" alt width="14px" height="14px">
                        </div>
                        <p class="koubei-text">口碑</p>
                    </div>
                    <ul class="contri">
                        <li
                            class="remark-item"
                            v-for="(item, index) in detailMovie.distributions"
                            :key="index"
                        >
                            <span class="remark-text">{{item.movieScoreLevel}}</span>
                            <div class="remark-percent">
                                <div class="remark-light" :style="{'width': `${item.proportion}%`}"></div>
                            </div>
                            <span class="remark-text">{{item.proportion}}%</span>
                        </li>
                    </ul>
                </div>
                <div class="maoyan-score">
                    <div class="maoyan-text">{{detailMovie.scoreLabel}}</div>
                    <div class="score-detail">
                        <span class="score-total">{{detailMovie.sc.toFixed(1)}}</span>
                        <star-item :totalScore="Math.ceil(detailMovie.sc)" :size="'10'"></star-item>
                    </div>
                    <div>{{detailMovie.snum}}人</div>
                </div>
            </div>

            <div class="btn" v-if="showBtn">
                <div class="wish" @click="toggleFav">
                    <icon-svg
                        :class="['like-icon',{'fav':favStatus}]"
                        name="like"
                        :fill="favStatus ? '#e54847' : '#ffffff' "
                        width="18"
                        height="18"
                    ></icon-svg>
                    <span>想看</span>
                </div>
                <div class="seen" @click="scoreToMovie">
                    <icon-svg name="store" width="16" height="16" class="store-icon"></icon-svg>
                    <span>看过</span>
                </div>
            </div>
            <div v-else class="my-score-wrap">
                <img src="/img/placeholder.png" alt width="34px" height="34px">
                <div class="my-score">
                    <span class="desc">看过啦，{{detailMovie.desc}}！ 我评</span>
                    <span class="total-score">
                        {{detailMovie.totalScore}}
                        <span class="fen">分</span>
                    </span>
                    <star-item :totalScore="detailMovie.totalScore"></star-item>
                </div>
            </div>
        </div>
        <div class="movie-intro" @click="limit = !limit">
            <div :class="['movie-desc', {'active': limit}]">{{detailMovie.dra}}</div>
            <div class="toggle-btn" v-show="detailMovie.dra">
                <icon-svg
                    class="arrow"
                    width="12"
                    height="12"
                    fill="#515151"
                    :style="{transform: limit ? 'rotate(180deg)' : 'rotate(0deg)'}"
                    name="arrow"
                ></icon-svg>
            </div>
        </div>
        <div class="media-photo" v-if="photos.length">
            <span>媒体库</span>
            <slider :data="photos" :gap="10">
                <div v-for="(item,index) in photos" :key="index" class="photo-item">
                    <img :src="item" alt>
                </div>
            </slider>
        </div>
        <movie-comment :hotComments="hotComments"></movie-comment>
        <router-view></router-view>
    </div>
</template>

<script>
import { getMovieDetail, getComments } from "/api/getData";
import { saveFavorite, deleteFavorite } from "/common/storage";
import { mapState, mapMutations } from "vuex";
import MovieComment from "./MovieComment";
import IconSvg from "/components/IconSvg";
import Slider from "/components/Slider";
import StarItem from "/components/StarItem";
import { getStore } from "/common/util";
export default {
    props: ["id"],
    data() {
        return {
            detailMovie: {},
            photos: [],
            comments: [],
            hotComments: [],
            limit: false,
            nothing: false,
            showBtn: true
        };
    },
    activated() {
        //因为使用了keep-alive来缓存组件，created钩子函数不会再次执行
        this._getMovieDetail();
        this._getComments();
    },
    computed: {
        ...mapState(["favoriteMovie"]),
        favStatus() {
            let index = this.favoriteMovie.findIndex(item => {
                return item.id == this.detailMovie.id;
            });
            return index > -1;
        },
        bgImg() {
            return this.detailMovie.img.replace("w.h", "148.220");
        }
    },
    components: {
        IconSvg,
        Slider,
        MovieComment,
        StarItem
    },
    methods: {
        ...mapMutations(["SAVE_FAVORITE"]),
        picFix(wh) {
            return wh.replace("w.h", "148.220");
        },
        _getMovieDetail() {
            this.$loading.show();
            this.showBtn = true;
            getMovieDetail(this.id).then(res => {
                this.detailMovie = res.data.detailMovie;
                this.photos = this.detailMovie.photos.map(photo => {
                    return photo.replace("w.h", "180.140");
                });
                this.favoriteMovie.forEach(item => {
                    if (item.id == this.detailMovie.id) {
                        this.detailMovie = item;
                        this.showBtn = !item.totalScore;
                    }
                });
                this.$route.meta.headerNavTitle = this.detailMovie.nm;
                this.$loading.hide();
            });
        },
        _getComments() {
            getComments(this.id).then(res => {
                this.paging = res.data.paging;
                this.comments = res.data.data.comments;
                this.hotComments = res.data.data.hotComments;
                this.nothing = !this.hotComments.length;
            });
        },
        toggleFav() {
            if (!getStore("movie-token")) {
                this.$toast("登陆后才可收藏");
                return;
            }
            let movies = [];
            if (!this.favStatus) {
                this.$toast("已添加到我的电影");
                this.detailMovie.time = new Date().getTime();
                movies = saveFavorite(this.detailMovie);
            } else {
                movies = deleteFavorite(this.detailMovie);
                this.$toast("已从我的电影移除");
            }
            this.SAVE_FAVORITE(movies);
        },
        scoreToMovie() {
            if (!getStore("movie-token")) {
                this.$toast("先去登陆吧");
                return;
            }
            this.$router.push("/movieDetail/movieScore");
        }
    }
};
</script>

<style lang="scss" scoped>
.movie-detail {
    position: fixed;
    top: 51px;
    bottom: 0;
    width: 100%;
    z-index: 9999;
    background-color: #f1f1f1;
    overflow-y: scroll;
    overflow-x: hidden;
    .movie-container {
        position: relative;
        color: #fff;
        padding: 0.3rem;
        line-height: 1;
        overflow: hidden;
        box-sizing: border-box;
        filter: blur(0);
    }
    .movie-bg,
    .movie-filter {
        top: 0;
        right: 0;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;

        &.movie-bg {
            z-index: 0;
            filter: blur(0.6rem);
            -webkit-filter: blur(0.6rem);
            background-size: cover;
            background-repeat: no-repeat;
            background-position-y: 40%;
        }
        &.movie-filter {
            background-color: #40454d;
            opacity: 0.55;
        }
    }
    .movie-info {
        position: relative;
        z-index: 2;
        display: flex;
        margin-bottom: 10px;

        .poster {
            display: block;
            width: 110px;
            height: 150px;
            box-sizing: border-box;
            background-color: #afafaf;
            border-radius: 3px;
        }
        .play-icon {
            @include ct;
            left: 45px;
            display: inline-block;
            width: 28px;
            height: 28px;
            @include bgi("/img/play.png", 28px, 28px);
        }

        .info-detail {
            margin-left: 10px;
            color: #d1d1d1;
            font-size: 13px;
            line-height: 20px;

            .zh-nm {
                margin-top: 3px;
                font-size: 20px;
                color: #fff;
            }
            .en-nm {
                margin-bottom: 6px;
            }
            .type {
                display: flex;
                .movie-tags {
                    text-align: center;
                    font-size: 12px;
                    color: #fff;
                    margin-top: -2px;
                    transform: scale(0.7);

                    .three-d,
                    .two-d {
                        background-color: #509fc9;
                        border-radius: 4px 0 0 4px;
                        padding: 3px 6px;
                    }

                    .IMAX {
                        margin-left: -1px;
                        padding: 2px;
                        color: #509fc9;
                        border: 1px solid #509fc9;
                        border-radius: 0 3px 3px 0;
                    }
                }
            }
            .want {
                margin-top: 10px;
                font-size: 13px;
                .want-s {
                    padding-right: 3px;
                    color: #fec000;
                    font-size: 20px;
                }
            }
        }
    }
    .score-wrap {
        position: relative;
        z-index: 2;
        display: flex;
        color: #f1f1f1;
        &::after {
            content: "";
            position: absolute;
            width: 1px;
            height: 100%;
            background-color: rgba(126, 126, 126, 0.55);
            left: 11.5%;
        }
        .koubei-score,
        .maoyan-score {
            padding: 3px;
            border-radius: 3px;
            background-color: rgba(110, 125, 137, 0.7);
            font-size: 12px;

            &.koubei-score {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                margin-right: 10px;
                .koubei {
                    text-align: center;
                    .maoyan-bg {
                        background-color: #fff;
                    }
                }
                .koubei-text {
                    margin-top: 5px;
                    font-weight: 700;
                }
                .contri {
                    margin-left: 10px;
                    text-align: right;
                    .remark-item {
                        display: flex;
                        font-size: 12px;
                        .remark-text {
                            width: 45px;
                            transform: scale(0.85);
                        }
                        .remark-percent {
                            margin: 5px 8px;
                            width: 75px;
                            background-color: #acacac;
                            height: 2px;
                            border-radius: 2px;
                            .remark-light {
                                background-color: #fec000;
                                width: 100%;
                                height: 100%;
                                border-radius: 2px;
                            }
                        }
                    }
                }
            }
            &.maoyan-score {
                flex: 0 1 80px;

                font-size: 12px;
                line-height: 16px;
                padding: 8px;
                .maoyan-text {
                    font-weight: 700;
                    font-size: 13px;
                }
                .score-detail {
                    display: flex;
                    align-items: center;
                    color: #fec000;
                    font-size: 15px;
                    font-weight: 600;
                }
            }
        }
    }

    .btn {
        margin-top: 10px;
        position: relative;
        z-index: 2;
        display: flex;
        .wish,
        .seen {
            flex: 1;
            line-height: 44px;
            align-items: center;
            text-align: center;
            border-radius: 3px;
            background-color: rgba(110, 125, 137, 0.7);
            &.wish {
                margin-right: 10px;
            }
            .like-icon,
            .store-icon {
                margin-top: -2px;
                margin-right: 5px;
            }
        }
    }

    .my-score-wrap {
        position: relative;
        display: flex;
        margin-top: 10px;
        align-items: center;
        color: #fff;
        border-radius: 3px;
        z-index: 6;
        background-color: rgba(110, 125, 137, 0.7);
        line-height: 40px;

        .my-score {
            display: flex;
            .desc {
                margin-left: 10px;
            }
            .total-score {
                margin: 0 12px;
                color: #fec000;
                font-size: 18px;
                font-weight: 600;
                .fen {
                    font-size: 14px;
                }
            }
        }
    }

    .movie-intro {
        position: relative;
        padding: 8px 15px;
        background-color: #fff;
        color: #333;
        line-height: 24px;
        .movie-desc {
            transition: all 0.45s ease-out;
            max-height: 72px;
            overflow: hidden;
            &.active {
                max-height: 720px;
            }
        }
        .toggle-btn {
            height: 12px;
            line-height: 12px;
            text-align: center;
            .arrow {
                transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
        }
    }
}
.fav {
    animation: bounce 0.7s cubic-bezier(0.23, 2, 0.32, 1);
}
@keyframes bounce {
    0% {
        transform: scale3d(0.2, 0.2, 0.2);
    }
    50% {
        transform: scale3d(1.3, 1.3, 1.3);
    }
    100% {
        transform: scale3d((1, 1, 1));
    }
}
.media-photo {
    background-color: #fff;
    margin: 10px 0;
    padding: 0 15px;
    height: 120px;
    line-height: 34px;
    color: #666;
    .photo-item {
        margin-left: 10px;
        img {
            width: 120px;
            height: 80px;
            border-radius: 2px;
        }
    }
}
</style>