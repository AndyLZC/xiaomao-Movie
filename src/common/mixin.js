import {
    moreComingList
} from "/api/getData";
import MovieItem from "/view/movie/MovieItem";
import Scroll from "/components/Scroll";
export const movieMixin = {
    components: {
        MovieItem,
        Scroll
    },
    methods: {
        onPullingUp() {
            if (this.movieIds.length == this.limit) return;
            moreComingList({
                token: "",
                movieIds: this.movieIds.splice(this.limit, 10).join(",")
            }).then(res => {
                if (this.limit == 10) {
                    this.comingList = {
                        ...this.comingList,
                        ...this._normalizeData(res.data.coming)
                    }
                } else {
                    this.hotList = this.hotList.concat(res.data.coming)
                }
            });
        }
    }
}