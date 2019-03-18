<template>
    <transition name="left">
        <div class="movie-score">
            <div class="header">
                <icon-svg
                    name="close"
                    fill="#aaaaaa"
                    width="16"
                    height="16"
                    class="back-icon"
                    @click.native="goBack()"
                ></icon-svg>看过
                <span class="save" @click="save()">保存</span>
            </div>
            <div class="rating-box">
                <div class="score-wrap">
                    <div class="total-score" v-show="totalScore">
                        <span>{{totalScore}}</span>
                        <span class="fen">分</span>
                    </div>
                </div>
                <div class="desc">{{desc || '期待你的打分'}}</div>
                <div class="star-list">
                    <icon-svg
                        :name="name(index)"
                        width="28"
                        height="28"
                        class="star-item"
                        :class="{'active': starIndex == index}"
                        v-for="(star,index) in 5"
                        :key="index"
                        @click.native="rating(index)"
                    ></icon-svg>
                </div>
            </div>
            <div class="input-box">
                <textarea placeholder="好看吗？快来写下你的感受吧~" class="comment-content" v-model="comment"></textarea>
            </div>
        </div>
    </transition>
</template>

<script>
import IconSvg from "/components/IconSvg";
import Movie from "/common/movie";
import { saveFavorite } from "/common/storage";
import { mapMutations } from "vuex";
export default {
    props: {},
    data() {
        return {
            totalScore: 0,
            starIndex: -1,
            comment: ""
        };
    },
    components: {
        IconSvg
    },
    computed: {
        desc() {
            const map = {
                0: "超烂啊",
                1: "比较差",
                2: "一般般",
                3: "比较好",
                4: "棒极了"
            };
            if (this.totalScore === 10) return "完美";
            return map[this.starIndex];
        }
    },
    methods: {
        ...mapMutations(["SAVE_FAVORITE"]),
        goBack() {
            if (this.comment || this.totalScore) {
                this.$alert({
                    msg: "退出将不保存当前编辑",
                    confirmBtnText: "退出",
                    cancelBtnText: "取消"
                }).then(res => {
                    if (res == "confirm") {
                        this.$router.go(-1);
                    }
                });
            } else {
                this.$router.go(-1);
            }
        },
        save() {
            let movies = [];
            this.$parent.detailMovie.time = new Date().getTime();
            this.$parent.detailMovie.comment = this.comment;
            this.$parent.detailMovie.totalScore = this.totalScore;
            this.$parent.detailMovie.desc = this.desc;
            movies = saveFavorite(this.$parent.detailMovie);
            this.SAVE_FAVORITE(movies);
            this.$toast("已保存到我的电影");
            this.$parent.showBtn = false;
            this.$router.go(-1);
        },
        rating(index) {
            this.starIndex = index;
            this.totalScore =
                this.totalScore !== index * 2 + 1
                    ? index * 2 + 1
                    : (index + 1) * 2;
        },
        name(index) {
            return this.totalScore < index * 2 + 1
                ? "null"
                : this.totalScore >= (index + 1) * 2
                ? "full"
                : "haft";
        }
    }
};
</script>
<style lang="scss" scoped>
.movie-score {
    position: fixed;
    top: 0px;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    z-index: 99;
    text-align: center;
    .header {
        position: relative;
        line-height: 50px;
        background-color: #fbfbfb;
        color: #444;
        font-size: 18px;
        .back-icon {
            @include ct;
            left: 25px;
        }
        .save {
            @include ct;
            right: 15px;
            line-height: 28px;
            padding: 0 10px;
            color: #fff;
            border-radius: 3px;
            background-color: #f80303;
            font-size: 12px;
        }
    }
    .rating-box {
        margin-top: 15px;
        padding: 20px 15px;
        color: #fec000;
        border-bottom: 1px solid #f1f1f1;
        .score-wrap {
            height: 50px;
            .total-score {
                font-size: 50px;
                .fen {
                    font-size: 14px;
                }
            }
        }
        .desc {
            line-height: 30px;
            color: #c1c1c1;
            font-size: 13px;
        }
        .star-list {
            margin-top: 10px;
            .star-item {
                margin-left: 12px;
                &.active {
                    animation: move 0.7s;
                }
            }
        }
    }
    .input-box {
        padding: 15px;
        text-align: left;
        .comment-content {
            width: 100%;
            color: $themeColor;
            font-size: 14px;
            -webkit-text-fill-color: #a1a1a1;
        }
    }
}
@keyframes move {
    0% {
        transform: translate3d(0, 0, 0);
    }
    50% {
        transform: translate3d(0, -10px, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}
</style>
