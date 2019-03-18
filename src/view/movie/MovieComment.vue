<template>
    <div class="movie-comment">
        <div class="title" v-if="hotComments.length">精彩热评</div>
        <ul class="comments-list">
            <li class="comment-item" v-for="(item, index) in hotComments" :key="index">
                <img :src="item.avatarUrl" alt class="avatar">
                <div class="comment-info">
                    <div class="user-info">
                        <span class="nick-name">{{item.nick}}</span>
                        <img :src="`img/lv${item.userLevel}.png`" alt class="level">
                        <div class="score">给这部作品打了{{item.score}}分</div>
                    </div>
                    <div class="content">{{item.content}}</div>
                    <div class="comment-detail">
                        <span class="pub-time">{{formatTime(item.time)}}</span>
                        <div class="btn reply">
                            <icon-svg name="reply"></icon-svg>
                            {{item.replyCount}}
                        </div>
                        <div class="btn thumb">
                            <icon-svg name="thumb"></icon-svg>
                            {{item.upCount}}
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { Time } from "/common/util";
export default {
    props: {
        hotComments: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        formatTime(time) {
            return Time.transTime(time, "yyyy-MM-dd");
        }
    }
};
</script>

<style lang="scss" scoped>
.movie-comment {
    background-color: #fff;
    .title {
        line-height: 30px;
        margin-left: 15px;
    }
    .comment-item {
        display: flex;
        border-bottom: 1px solid #f1f1f1;
        padding: 10px 15px;
        .avatar {
            flex: 0 0 34px;
            height: 34px;
            border-radius: 100%;
            background-color: #a1a1a1;
        }
        .comment-info {
            margin-left: 15px;
            width: 100%;
            font-size: 12px;
            color: #999;
            .user-info {
                line-height: 16px;
                margin-left: -25px;
                transform: scale(0.85);
                .nick-name {
                    color: #333;
                }
                .level {
                    margin-left: 5px;
                    width: 37px;
                }
            }
            .content {
                margin: 5px 0 10px 0;
                line-height: 18px;
                font-size: 14px;
                color: #333;
                line-height: 1.5;
                text-align: justify;
            }
            .comment-detail {
                line-height: 24px;
                margin: 5px 0 3px 0;
                .btn {
                    float: right;
                    padding: 0px 5px;
                    border-radius: 50px 50px;
                    border: 1px solid #b1b1b1;
                    margin-left: 8px;
                }
            }
        }
    }
    .no-data {
        position: relative;
    }
}
</style>