<template>
    <div class="movie-list-wrapper">
        <ul class="movie-list">
            <li class="movie-item">
                <img class="movie-poster" :src="picFix(item.img)" alt="poster">
                <div class="movie-info-wrapper">
                    <div class="movie-info">
                        <div class="movie-title">
                            <div class="movie-name">
                                {{item.nm}}
                                <div class="movie-tags" v-if="item.version">
                                    <span class="three-d" v-if="item.version.indexOf('v3d') > -1">3D</span>
                                    <span class="two-d" v-if="item.version.indexOf('v2d') > -1">2D</span>
                                    <span class="IMAX" v-if="item.version.indexOf('imax') > -1">IMAX</span>
                                </div>
                            </div>
                            <div class="score-see">
                                <span v-if="item.sc">
                                    <span class="score">{{item.sc}}</span>分
                                </span>
                                <span class="want-s" v-else-if="item.wish">
                                    <span class="number">{{item.wish}}</span>人想看
                                </span>
                                <span class="no-score" v-else>暂无评分</span>
                            </div>
                        </div>
                        <div class="detail">
                            <div class="info-detail">
                                <p class="e-name" v-if="item.enm">{{item.enm}}</p>
                                <div class="type">{{item.cat}}</div>
                                <div class="show-time">{{item.rt}}</div>
                            </div>
                            <div
                                class="tickey-btn"
                                :style="{backgroundColor: bgColor}"
                                v-if="item.showst !==2"
                            >{{type(item.showst)}}</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "movie-item",
    props: {
        item: {
            type: Object
        }
    },
    data() {
        return {
            bgColor: ""
        };
    },
    methods: {
        type(showst) {
            switch (showst) {
                case 1:
                    this.bgColor = "#faaf00";
                    return "想看";
                    break;
                case 3:
                    this.bgColor = "#f03d37";
                    return "购票";
                    break;
                case 4:
                    this.bgColor = "#3c9fe6";
                    return "预售";
                    break;
            }
        },
        picFix(wh) {
            return wh.replace("w.h", "64.90");
        }
    },
    components: {}
};
</script>

<style lang="scss" scoped>
.movie-list {
    .movie-item {
        display: flex;
        padding: 0 15px;
        border-bottom: 1px solid #e6e6e6;

        .movie-poster {
            flex: 0 1 64px;
            margin: 12px 0;
            height: 90px;
            border-radius: 2px;
        }

        .movie-info-wrapper {
            flex: 1;
            height: 90px;
            display: flex;
            align-items: center;
            padding: 12px 0;
            margin: 0 10px;

            .movie-info {
                flex: 1;

                .movie-title {
                    display: flex;
                    flex: 1;
                    align-items: center;

                    .movie-name {
                        display: flex;
                        flex: 1;
                        padding-right: 1px;
                        line-height: 24px;
                        height: 24px;
                        color: #333;
                        font-size: 17px;
                        font-weight: 700;
                        //max-width: 80px;
                        @include ellipsis;

                        .movie-tags {
                            text-align: center;
                            font-size: 12px;
                            color: #fff;
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

                    .score-see {
                        color: #fa0;
                        font-size: 12px;

                        .number,
                        .score {
                            font-size: 16px;
                        }

                        .no-score {
                            font-size: 14px;
                            color: #666;
                        }
                    }
                }

                .detail {
                    display: flex;
                    align-items: center;

                    .info-detail {
                        flex: 1;
                        margin-top: 6px;
                        font-size: 13px;
                        color: #666;
                        line-height: 1;

                        .e-name {
                            font-size: 13px;
                            color: #666;
                        }

                        .type,
                        .show-time {
                            margin-top: 6px;
                            line-height: 15px;
                            max-width: 50vw;
                            @include ellipsis;
                        }
                    }

                    .tickey-btn {
                        width: 47px;
                        height: 27px;
                        line-height: 28px;
                        color: #fff;
                        text-align: center;
                        font-size: 12px;
                        border-radius: 47px;
                    }
                }
            }
        }
    }
}
</style>