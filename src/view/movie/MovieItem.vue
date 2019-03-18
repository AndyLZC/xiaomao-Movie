<template>
    <div class="movie-list-wrapper" @click="selectMovie(movie)">
        <ul class="movie-list">
            <li class="movie-item">
                <img class="movie-poster" :src="picFix(movie.img)" alt="poster">
                <div class="movie-info-wrapper">
                    <div class="movie-info">
                        <div class="movie-title">
                            <span class="movie-name">{{movie.nm}}</span>
                            <div class="movie-tags">
                                <span class="three-d" v-if="movie.version.indexOf('v3d') > -1">3D</span>
                                <span class="two-d" v-if="movie.version.indexOf('v2d') > -1">2D</span>
                                <span class="IMAX" v-if="movie.version.indexOf('imax') > -1">IMAX</span>
                                <span class="preshow" v-if="movie.preShow">点映</span>
                            </div>
                        </div>
                        <div class="info-detail">
                            <p class="score-want">
                                <span class="score" v-if="movie.showst == 3 && movie.sc">
                                    观众评
                                    <span class="score-s">{{movie.sc.toFixed(1)}}</span>
                                </span>
                                <span class="want" v-else-if="movie.showst !== 3">
                                    <span class="want-s" v-if="movie.wish">{{movie.wish}}</span>人想看
                                </span>
                            </p>
                            <div class="movie-actors">主演：{{movie.star}}</div>
                            <div class="movie-show">{{movie.showInfo}}</div>
                        </div>
                    </div>
                    <div
                        class="tickey-btn"
                        :style="{backgroundColor: type(movie.showst).bgColor}"
                    >{{type(movie.showst).text}}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "movie-item",
    props: {
        movie: {
            type: [Array, Object]
        }
    },
    methods: {
        type(showst) {
            const map = {
                1: { bgColor: "#faaf00", text: "想看" },
                2: { bgColor: "#3c9fe6", text: "预售" },
                3: { bgColor: "#f03d37", text: "购票" },
                4: { bgColor: "#3c9fe6", text: "预售" }
            };
            return map[showst];
        },
        picFix(wh) {
            return wh.replace("w.h", "128.189");
        },
        selectMovie(movie) {
            this.$router.push({ path: `/movieDetail/${movie.id}` });
            this.$route.meta.headerNavTitle = movie.nm;
        }
    }
};
</script>

<style lang="scss" scoped>
.movie-list {
    .movie-item {
        display: flex;
        padding: 0 15px;

        .movie-poster {
            flex: 0 1 64px;
            margin: 12px 0;
            height: 90px;
            border-radius: 4px;
        }

        .movie-info-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 12px 0;
            margin: 0 10px;
            border-bottom: 1px solid #e6e6e6;

            .movie-info {
                flex: 1;

                .movie-title {
                    display: flex;

                    .movie-name {
                        padding-right: 1px;
                        max-width: 33.3vw;
                        line-height: 24px;
                        color: #333;
                        font-size: 17px;
                        font-weight: 700;
                        @include ellipsis;
                    }

                    .movie-tags {
                        text-align: center;
                        font-size: 12px;
                        color: #fff;
                        margin-top: 5px;
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

                        .preshow {
                            background-color: #faaf00;
                            margin-left: 4px;
                            padding: 3px;
                            border-radius: 2px;
                        }
                    }
                }

                .info-detail {
                    font-size: 13px;
                    color: #666;
                    line-height: 1;

                    .score-want {
                        margin-top: 7px;

                        .score-s,
                        .want-s {
                            font-weight: 700;
                            color: #faaf00;
                            font-size: 15px;
                        }
                    }

                    .movie-actors,
                    .movie-show {
                        margin-top: 6px;
                        line-height: 15px;
                        max-width: 50vw;
                        @include ellipsis;
                    }
                }
            }

            .tickey-btn {
                width: 50px;
                height: 26px;
                line-height: 26px;
                color: #fff;
                text-align: center;
                font-size: 12px;
                border-radius: 47px;
            }
        }
    }
}
</style>