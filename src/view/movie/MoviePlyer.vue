<template>
    <transition name="right">
        <div class="player-wrap">
            <video id="myVideo" class="video-js">
                <source :src="videoSrc">
            </video>
            <div class="movie-item">
                <img class="movie-poster" :src="picFix(movie.img)" alt="poster">
                <div class="movie-info-wrapper">
                    <div class="movie-info">
                        <div class="movie-nm">{{movie.nm}}</div>
                        <div class="movie-en">{{movie.enm}}</div>
                        <div class="movie-pub-time">{{movie.pubDesc}}</div>
                        <div class="movie-cat">{{movie.cat}}</div>
                        <div class="movie-actors">主演：{{movie.star}}</div>
                    </div>
                    <div class="score">猫眼评分{{movie.sc.toFixed(1)}}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Video from "video.js";
import "video.js/dist/video-js.css";
import MovieItem from "./MovieItem";
export default {
    data() {
        return {
            videoSrc: "",
            movie: ""
        };
    },
    created() {
        this.movie = this.$route.query.detailMovie;
        this.videoSrc = this.$route.query.detailMovie.videourl;
    },
    mounted() {
        this._initVideo();
    },
    components: {
        MovieItem
    },
    methods: {
        _initVideo() {
            //初始化视频方法
            let myPlayer = Video(myVideo, {
                //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
                controls: true,
                //自动播放属性,muted:静音播放
                autoplay: "muted",
                //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
                preload: "auto",
                //设置视频播放器的显示宽度（以像素为单位）
                width: "800px",
                //设置视频播放器的显示高度（以像素为单位）
                height: "200px"
            });
        },
        picFix(wh) {
            return wh.replace("w.h", "128.189");
        }
    }
};
</script>
<style lang="scss" scoped>
.player-wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    z-index: 999;
    .myVideo-dimensions {
        width: auto;
    }
    .movie-item {
        display: flex;
        margin: 10px;
        padding: 0 5px;
        box-shadow: 0 0 18px rgba(0, 0, 0, 0.15);

        .movie-poster {
            flex: 0 1 64px;
            margin: 12px 0;
            height: 90px;
            border-radius: 2px;
        }

        .movie-info-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 12px 0;
            margin: 0 10px;

            .movie-info {
                flex: 1;
                font-size: 12px;

                .movie-nm {
                    color: #333;
                    font-size: 18px;
                    max-width: 170px;
                    @include ellipsis;
                }
                .movie-en {
                    color: #999;
                    margin-bottom: 10px;
                }

                .movie-actors,
                .movie-pub-time,
                .movie-cat {
                    transform: scale(0.9);
                    margin-left: -10px;
                    line-height: 15px;
                    max-width: 170px;
                    color: #666;
                    @include ellipsis;
                }
            }
            .score {
                font-size: 13px;
                color: #fec000;
            }
        }
    }
}
</style>
