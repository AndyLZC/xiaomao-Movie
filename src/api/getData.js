import http from './public'
import { Time } from "/common/util"

/* 即将上映的电影 */
export const getComingList = (ci) => {
  return http.fetchGet(`/movie/ajax/comingList`, {
    ci,
    token: '',
    limit: 10
  })
}

/* 最受期待 */
export const getExpectedList = (ci) => {
  return http.fetchGet(`/movie/ajax/mostExpected`, {
    ci,
    token: '',
    limit: 10,
    offset: ''
  })
}

/* 热映电影 */
export const getHotList = (ci) => {
  return http.fetchGet(`/movie/ajax/movieOnInfoList`, {
    ci,
    token: '',
    limit: 10
  })
}

/* 当前城市影院列表 */
export const getCinemaFilter = (ci) => {
  return http.fetchGet(`/movie/ajax/filterCinemas`, {
    ci
  })
}

/* 影院列表过滤 */
export const getCinemaList =
  (cityId, lat, lng, districtId, areaId, lineId, stationId, brandId, serviceId, hallType) => {
    let params = {
      day: Time.getFormatTime(new Date().getTime(), "yyyy-MM-dd"),
      offset: 0,
      limit: 20,
      districtId,
      lineId,
      hallType,
      brandId,
      serviceId,
      areaId,
      stationId,
      item: "",
      updateShowDay: true,
      reqId: new Date().getTime(),
      cityId: cityId,
      lat: lat,
      lng: lng
    }
    return http.fetchGet(`/movie/ajax/cinemaList`, params)
  }

/* 搜索电影、影院 */
export const searchData = (kw, cityId) => {
  return http.fetchGet(`/movie/ajax/search`, {
    kw,
    cityId,
    stype: -1
  })
}

/* 更多电影 */
export const moreComingList = (params) => {
  return http.fetchGet(`/movie/ajax/moreComingList`, params)
}

/* 获取地址 */
export const getAddress = () => {
  return new Promise((resolve, reject) => {
    const map = new AMap.Map('container', {})
    map.plugin('AMap.Geolocation', function () {
      const geolocation = new AMap.Geolocation({})
      geolocation.getCurrentPosition()
      AMap.event.addListener(geolocation, 'complete', (data) => {
        resolve(data)
      })
      AMap.event.addListener(geolocation, 'error', () => {
        reject('定位失败')
      })
    })
  })
}

/* 电影详情 */
export const getMovieDetail = (movieId) => {
  return http.fetchGet(`/movie/ajax/detailmovie`, {
    movieId
  })
}

/* 选取座位 */
export const getSeatPlan = (cityId, seqNo) => {
  return http.fetchPost(`/movie/ajax/seatingPlan`, {
    timestamp: new Date().getTime(),
    cityId,
    ci: cityId,
    seqNo
  })
}

/* 影院详情 */
export const getCinemaDetail = (cinemaId) => {
  return http.fetchGet(`/movie/ajax/cinemaDetail`, {
    cinemaId
  })
}

/* 票房 */
export const getBoxOffice = (beginDate) => {
  return http.fetchGet(`/boxOffice/second.json`, {
    beginDate
  })
}

/* 获取电影评论 */
export const getComments = (movieId) => {
  return http.fetchGet(`/movie/review/v2/comments.json`, {
    movieId,
    userId: -1,
    offset: 0,
    limit: 15,
    ts: 0,
    type: 3
  })
}