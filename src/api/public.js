import axios from 'axios'

export default {
  async fetchGet(url, params = {}) {
    try {
      return await axios.get(url, { params })
    } catch (err) {
      console.log(err)
    }
  },
  async fetchPost(url, params) {
    try {
      return await axios.post(url, params)
    } catch (err) {
      console.log(err)
    }
  }
}