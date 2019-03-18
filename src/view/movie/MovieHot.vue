<template>
    <div class="hot-wrap">
        <scroll v-if="hotList.length" :data="hotList" :pullingUp="true" @pullingUp="onPullingUp">
            <div class="movie-hot">
                <movie-item v-for="movie in hotList" :key="movie.id" :movie="movie"></movie-item>
            </div>
        </scroll>
        <transition name="fade">
            <skeleton-movie v-if="!hotList.length"></skeleton-movie>
        </transition>
    </div>
</template>

<script>
import { movieMixin } from "/common/mixin";
import { getHotList } from "/api/getData";
import { getStore } from "/common/util";
import { mapState } from "vuex";
import SkeletonMovie from "/components/skeleton/SkeletonMovie";

export default {
    mixins: [movieMixin],
    data() {
        return {
            hotList: [],
            movieIds: [],
            hasMore: false,
            limit: 12
        };
    },
    created() {
        this._getHotList();
    },
    components: {
        SkeletonMovie
    },
    computed: {
        ...mapState(["currentCity"])
    },
    methods: {
        _getHotList() {
            getHotList(this.currentCity.id).then(res => {
                this.hotList = res.data.movieList;
                this.movieIds = res.data.movieIds;
            });
        }
    },
    watch: {
        currentCity() {
            this._getHotList();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>