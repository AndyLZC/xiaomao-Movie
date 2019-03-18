<template>
    <div class="favorite-list">
        <div class="favorite-item" v-for="item in movies" :key="item.id">
            <p class="title">
                <span @click="deleteFav(item)" class="arrow">
                    <icon-svg name="arrow" fill="#ccc"></icon-svg>
                </span>
            </p>
            <div class="score-wrap" v-if="item.totalScore">
                <span class="text">我评:</span>
                <div class="star-list">
                    <star-item :totalScore="item.totalScore"></star-item>
                </div>
                <span>{{item.totalScore}}分, {{item.desc}}</span>
                <icon-svg :name="emoji(item.totalScore)" class="emoji" width="16" height="16"></icon-svg>
            </div>
            <div class="movie-detail" @click="selectFav(item)">
                <img :src="picFix(item.img)" alt>
                <div class="movie-info">
                    <div class="movie-nm">{{item.nm}}</div>
                    <div class="movie-enm">{{item.enm}}</div>
                    <div class="movie-cat">{{item.cat}}</div>
                    <div class>
                        <span class="movie-sc">{{item.src}}</span>
                        /
                        <span class="movie-dur">{{item.dur}}分钟</span>
                    </div>
                    <div class="pub-time">{{item.pubDesc}}</div>
                </div>
            </div>
            <span class="time">{{transTime(item.time)}}</span>
        </div>
    </div>
</template>

<script>
import StarItem from "/components/StarItem";

import { Time } from "/common/util";

export default {
    props: {
        movies: {
            type: Array
        }
    },
    components: {
        StarItem
    },
    methods: {
        picFix(wh) {
            return wh.replace("w.h", "148.220");
        },
        transTime(timeStamp) {
            return Time.transTime(timeStamp, "yyyy-MM-dd");
        },
        selectFav(item) {
            this.$router.push({ path: `/movieDetail/${item.id}` });
            this.$route.meta.headerNavTitle = item.nm;
        },
        deleteFav(item) {
            this.$emit("delete-movie", item);
        },
        emoji(score) {
            return score <= 4 ? "bad" : score <= 8 ? "just-so-so" : "good";
        }
    }
};
</script>

<style lang="scss" scoped>
.favorite-item {
    margin-bottom: 8px;
    padding: 10px 15px 10px 15px;
    background-color: #fff;
    border-bottom: 1px solid #f1f1f1;
    .title {
        color: #777;
        .time {
            font-size: 12px;
        }
        .arrow {
            float: right;
        }
    }
    .score-wrap {
        line-height: 30px;
        color: #fec000;
        font-size: 12px;
        .star-list {
            display: inline-block;
            margin-right: 10px;
        }
        .text {
            margin-right: 3px;
            color: #aaa;
            vertical-align: 2px;
        }
        .emoji {
            margin-left: 5px;
        }
    }
    .movie-detail {
        padding-bottom: 5px;
        width: 100%;
        display: flex;
        img {
            width: 70px;
            height: 107px;
            border-radius: 2px;
            background-color: #aaa;
        }
        .movie-info {
            flex: 1;
            padding: 8px;
            background-color: #f1f1f1;
            line-height: 17px;
            max-width: 240px;

            font-size: 12px;
            color: #a1a1a1;
            .movie-nm {
                color: #333;
                font-weight: 600;
                font-size: 18px;
            }
            .movie-enm {
                margin-bottom: 6px;
                @include ellipsis;
            }
        }
    }
    .time {
        font-size: 12px;
    }
}
.no-data {
    margin-top: 40px;
}
</style>