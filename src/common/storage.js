import { getStore, setStore, removeStore } from "./util"

function insertToArr(arr, val, compare, maxLen) {
    let index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

function deleteFromArr(arr, compare) {
    let index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function deleteFavorite(movie) {
    let movies = getStore('movies', [])
    deleteFromArr(movies, (item) => {
        return movie.id === item.id
    })
    setStore('movies', movies)
    return movies
}
export function saveFavorite(movie) {
    let movies = getStore('movies', [])
    insertToArr(movies, movie, (item) => {
        return movie.id === item.id
    })
    setStore('movies', movies)
    return movies
}


export function loadFavorite() {
    return getStore('movies', [])
}

export function saveTickey(tickey) {
    let tickeys = getStore('tickeys', [])
    console.log(tickeys)
    insertToArr(tickeys, tickey, (item) => {
        return tickey.orderId === item.orderId
    })
    setStore('tickeys', tickeys)
    return tickeys
}

export function loadTickey() {
    return getStore('tickeys', [])
}