<template>
    <div class="coming-container">
        <scroll
            :pullingUp="true"
            @pullingUp="onPullingUp"
            :data="comingList"
            class="coming-list-wrap"
        >
            <div class="movie-coming" ref="coming">
                <div class="title">最近受期待</div>
                <slider
                    :scrollX="true"
                    :data="expectedList"
                    :gap="12"
                    class="most-expected"
                    v-if="expectedList.length && currentIndex"
                >
                    <div
                        class="expected-item"
                        v-for="item in expectedList"
                        :key="item.id"
                        @click="selectExpected(item)"
                    >
                        <img :src="picFix(item.img)" alt class="poster">
                        <h5 class="movie-nm">{{item.nm}}</h5>
                        <p class="show-day">{{item.comingTitle}}</p>
                    </div>
                </slider>
                <div class="coming-list">
                    <div v-for="(items, key) in comingList" :key="key" class="group-list">
                        <p class="group-day">{{key}}</p>
                        <movie-item v-for="movie in items.items" :key="movie.id" :movie="movie"></movie-item>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
import { movieMixin } from "/common/mixin";
import { getComingList, getExpectedList } from "/api/getData";
import { getStore } from "/common/util";
import { mapState } from "vuex";
import Slider from "/components/Slider";
export default {
    mixins: [movieMixin],
    props: {
        currentIndex: {
            type: Number
        }
    },
    data() {
        return {
            comingList: [],
            hasMore: false,
            movieIds: [],
            limit: 10,
            expectedList: []
        };
    },
    created() {
        this._getExpectedList(this.currentCity.id);
        this._getComingList(this.currentCity.id);
    },
    components: {
        Slider
    },
    computed: {
        ...mapState(["currentCity"])
    },
    methods: {
        _getExpectedList(id) {
            getExpectedList(id).then(res => {
                this.expectedList = res.data.coming;
            });
        },
        _getComingList(id) {
            getComingList(id).then(res => {
                this.comingList = this._normalizeData(res.data.coming);
                this.movieIds = res.data.movieIds;
            });
        },
        picFix(wh) {
            return wh.replace("w.h", "170.238");
        },
        onPullingDown() {},
        selectExpected(item) {
            this.$router.push({ path: `/movieDetail/${item.id}` });
            this.$route.meta.headerNavTitle = item.nm;
        },
        _normalizeData(list) {
            let map = {};
            list.forEach(item => {
                if (!map[item.comingTitle]) {
                    map[item.comingTitle] = {
                        day: item.comingTitle,
                        items: []
                    };
                }
                map[item.comingTitle].items.push(item);
            });
            return map;
        }
    },
    watch: {
        currentCity() {
            this._getExpectedList(this.currentCity.id);
            this._getComingList(this.currentCity.id);
        }
    }
};
</script>

<style lang="scss" scoped>
.coming-container {
    .title {
        line-height: 40px;
        padding-left: 12px;
        color: #666;
        font-weight: 600;
    }
    .most-expected {
        padding: 0px 0 0px 12px;
        margin: 0 12px 10px 12px;
        background-color: #fff;
        .expected-item {
            margin-right: 10px;
            line-height: 14px;
            width: 85px;
            .poster {
                width: 85px;
                height: 115px;
                border-radius: 2px;
            }
            .movie-nm {
                color: #222;
                font-size: 13px;
                margin: 4px 0;
                @include ellipsis;
            }
            .show-day {
                font-size: 12px;
                color: #999;
            }
        }
    }
}
.coming-list {
    margin-top: 165px;
    .group-list {
        .group-day {
            padding: 12px 15px 0;
            font-size: 13px;
            color: $themeColor;
            font-weight: 700;
        }
    }
}
</style>