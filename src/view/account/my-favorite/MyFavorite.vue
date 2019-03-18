<template>
    <transition name="right">
        <div class="my-favorite">
            <ul class="tabs">
                <li
                    class="tab-item"
                    v-for="(tab,index) of tabs"
                    :key="index"
                    @click="changeTab(index)"
                >{{tab}}</li>
                <span class="nav-bar" :style="{'left': pos}"></span>
            </ul>
            <transition name="left">
                <div class="fav" v-show="!tabIndex">
                    <fav-item :movies="favMovie" @delete-movie="deleteMovie($event)"></fav-item>
                    <no-data class="no-data" text="没有想看的电影，去挑一部吧" v-if="!favMovie.length"></no-data>
                </div>
            </transition>
            <transition name="right">
                <div class="seen" v-show="tabIndex">
                    <fav-item :movies="seenMovie" @delete-movie="deleteMovie($event)"></fav-item>
                    <no-data class="no-data" text="没有看过的电影，去挑一部吧" v-if="!seenMovie.length"></no-data>
                </div>
            </transition>
            <delete-btn
                @delete-one="deleteOne"
                @hide-btn="showDeleteBtn = !showDeleteBtn"
                v-show="showDeleteBtn"
            ></delete-btn>
        </div>
    </transition>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { deleteFavorite } from "/common/storage";
import DeleteBtn from "/components/DeleteBtn";
import FavItem from "./FavoriteItem";
import NoData from "/components/NoData";
export default {
    data() {
        return {
            showDeleteBtn: false,
            tabs: ["想看的电影", "看过的电影"],
            tabIndex: 0,
            pos: "12.5%",
            deleteItem: {}
        };
    },
    computed: {
        ...mapState(["favoriteMovie"]),
        favMovie() {
            return this.favoriteMovie.filter(item => {
                return !item.totalScore;
            });
        },
        seenMovie() {
            return this.favoriteMovie.filter(item => {
                return item.totalScore;
            });
        }
    },
    components: {
        DeleteBtn,
        FavItem,
        NoData
    },
    methods: {
        ...mapMutations(["SAVE_FAVORITE"]),
        changeTab(index) {
            this.tabIndex = index;
            this.pos = index ? "62.5%" : "12.5%";
        },
        deleteMovie(movie) {
            this.deleteItem = movie;
            this.showDeleteBtn = true;
        },
        deleteOne() {
            let movies = deleteFavorite(this.deleteItem);
            this.SAVE_FAVORITE(movies);
            this.showDeleteBtn = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.my-favorite {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    .tabs {
        position: fixed;
        display: flex;
        top: 50px;
        width: 100%;
        z-index: 9;
        background-color: #fff;
        .tab-item {
            flex: 1;
            line-height: 40px;
            text-align: center;
            color: #333;
            font-weight: 600;
        }
        .nav-bar {
            position: absolute;
            bottom: 1px;
            height: 2px;
            width: 25%;
            background-color: $themeColor;
            transition: all 0.35s cubic-bezier(0.55, 0, 0.1, 1);
        }
    }
    .fav,
    .seen {
        position: absolute;
        top: 50px;
        bottom: 0;
        width: 100%;
    }
}
</style>