<template>
    <div class="search-wrapper">
        <div class="search-header">
            <div class="input-wrapper">
                <icon-svg class="search-icon" name="search" fill="#bbb" width="16" height="16"></icon-svg>
                <input type="text" class="search-input" placeholder="搜电影、影院" v-model="keyword">
                <icon-svg
                    class="delete"
                    name="delete"
                    width="16"
                    height="16"
                    v-show="keyword"
                    @click.native="clear"
                ></icon-svg>
            </div>
            <div class="cancel" @click="$router.go(-1)">取消</div>
        </div>

        <ul class="search-history" v-show="!keyword && historyList.length">
            <li
                class="history-item"
                v-for="(item, index) in historyList"
                :key="index"
                @click="chooseKeyWord(item)"
            >
                <icon-svg class="record-icon" name="record" width="18" height="18" fill="#bfbfbf"></icon-svg>
                <span class="search-history">{{item}}</span>
                <icon-svg
                    class="del-history"
                    name="del-history"
                    width="28"
                    height="28"
                    @click.native.stop="delHistory(index)"
                ></icon-svg>
            </li>
            <li class="clearAll" @click="delAllHistory">清空所有历史
                <icon-svg name="clear-all" width="15" height="15"></icon-svg>
            </li>
        </ul>

        <div class="search-result" v-show="keyword">
            <div class="movie-result" v-if="movieResult.length">
                <p class="classify-title">电影/电视剧/综艺</p>
                <transition-group tag="div" name="fade">
                    <search-movie-item
                        v-for="(movie,index) in movieResult"
                        v-show="index < 3"
                        :key="movie.id"
                        :item="movie"
                        @click.native="selectItem(movie)"
                    ></search-movie-item>
                </transition-group>
                <p class="total-count">查看全部{{movieResult.length}}条结果</p>
            </div>
            <div class="cinema-result" v-if="cinemaResult.length">
                <p class="classify-title">影院</p>
                <transition-group tag="div" name="fade">
                    <search-cinema-item
                        v-for="(cinema,index) in cinemaResult"
                        v-show="index < 3"
                        :key="cinema.id"
                        :cinema="cinema"
                        @click.native="selectItem(cinema)"
                    ></search-cinema-item>
                </transition-group>
                <p class="total-count">查看全部{{cinemaResult.length}}条结果</p>
            </div>
        </div>
        <no-data class="no-result" v-if="keyword && nothing" :text="'没有相关搜索结果~~'"></no-data>
    </div>
</template>

<script>
import IconSvg from "/components/IconSvg";
import { debounce, getStore, setStore, removeStore } from "/common/util";
import { searchData } from "/api/getData";
import SearchCinemaItem from "./SearchCinemaItem";
import SearchMovieItem from "./SearchMovieItem";
import NoData from "/components/NoData";
import { mapState } from "vuex";
const HISTORY_COUNT = 6;
export default {
    data() {
        return {
            keyword: "",
            historyList: [],
            movieResult: [],
            cinemaResult: [],
            nothing: false
        };
    },
    components: {
        IconSvg,
        SearchMovieItem,
        SearchCinemaItem,
        NoData
    },
    created() {
        this.historyList = getStore("historyList", []);
        console.log(this.historyList);
    },
    computed: {
        ...mapState(["currentCity"])
    },
    methods: {
        clear() {
            this.keyword = "";
            this.nothing = false;
            (this.movieResult = []), (this.cinemaResult = []);
        },
        chooseKeyWord(item) {
            this.keyword = item;
        },
        delHistory(index) {
            this.historyList.splice(index, 1);
        },
        selectItem(item) {
            if (!this.historyList.includes(item.nm)) {
                this.historyList.unshift(item.nm);
                this.historyList.splice(HISTORY_COUNT);
                setStore("historyList", this.historyList);
            }
            if (item.addr) {
                this.$router.push({
                    path: `/cinemaDetail/${item.id}`
                });
                this.$route.meta.headerNavTitle = item.nm;
            } else {
                this.$router.push({
                    path: `/movieDetail/${item.id}`
                });
                this.$route.meta.headerNavTitle = item.nm;
            }
            this.$route.meta.headerNavTitle = item.nm;
        },
        delAllHistory() {
            this.$alert({
                msg: "是否清空当前搜索记录"
            }).then(res => {
                if (res === "confirm") {
                    this.historyList = [];
                    removeStore("historyList");
                } else {
                    return;
                }
            });
        }
    },
    watch: {
        keyword() {
            if (this.keyword) {
                const _self = this;
                debounce(() => {
                    this.$loading.show();
                    searchData(this.keyword, this.currentCity.id).then(res => {
                        _self.$loading.hide();
                        this.movieResult = res.data.movies
                            ? res.data.movies.list
                            : [];
                        this.cinemaResult = res.data.cinemas
                            ? res.data.cinemas.list
                            : [];
                        this.nothing = !(
                            this.cinemaResult.length || this.movieResult.length
                        );
                    });
                }, 1200)();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.search-wrapper {
    position: absolute;
    top: 51.5px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f5f5f5;

    .search-header {
        position: relative;
        display: flex;
        align-items: center;
        padding: 8px 0 8px 10px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #e5e5e5;
        z-index: 3;

        .input-wrapper {
            display: flex;
            flex: 1 1 auto;
            align-items: center;
            padding: 0 10px;
            border: 1px solid #e6e6e6;
            background-color: #fff;
            border-radius: 5px;

            .search-icon {
                vertical-align: middle;
                margin-right: 4px;
            }

            .search-input {
                flex: 1;
                line-height: 20px;
                padding: 4px 0;
                color: $themeColor;
                font-size: 13px;
                -webkit-text-fill-color: #666;
            }
        }

        .cancel {
            padding: 0 10px;
            font-size: 16px;
            color: $themeColor;
        }
    }

    .search-history {
        background-color: #fff;
        line-height: 44px;

        .history-item {
            display: flex;
            align-items: center;
            margin-left: 15px;

            border-bottom: 1px solid #e5e5e5;

            .record-icon {
                margin-right: 6px;
            }

            .search-history {
                flex: 1 1 auto;
            }

            .del-history {
                padding: 0px 10px 0 20px;
            }
        }

        .clearAll {
            text-align: center;
            color: $themeColor;
        }
    }
    .search-result {
        position: absolute;
        width: 100%;
        top: 47px;
        left: 0;
    }
    .movie-result,
    .cinema-result {
        background-color: #fff;

        .classify-title {
            // background-color: #fff;
            // position: relative;
            // z-index: 3;
            padding: 9px 15px;
            font-size: 15px;
            color: #999;
            border: 1px solid #e5e5e5;
        }

        .total-count {
            line-height: 44px;
            text-align: center;
            color: $themeColor;
        }
    }
}
</style>