import { getStore } from "/common/util";
import { loadFavorite, loadTickey } from "/common/storage"
let defaultCity = {
    "id": 20,
    "nm": "广州",
    "py": "guangzhou"
};
try {
    defaultCity = getStore('city', {});
} catch (err) {

}
export default {
    currentCity: defaultCity,
    address: {},
    favoriteMovie: loadFavorite(),
    tickeys: loadTickey()
}