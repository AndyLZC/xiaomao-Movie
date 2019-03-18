import {
    CHANGE_CITY,
    SAVE_ADDRESS,
    SAVE_FAVORITE,
    SAVE_TICKEY
} from './mutations_type'

export default {
    [CHANGE_CITY](state, city) {
        state.currentCity = city
    },
    [SAVE_ADDRESS](state, address) {
        state.address = address;
    },
    [SAVE_FAVORITE](state, movies) {
        state.favoriteMovie = movies
    },
    [SAVE_TICKEY](state, tickeys) {
        state.tickeys = tickeys
    }
}