import Vue from 'vue'
import App from './App.vue'
import fastClick from 'fastclick'
import router from './router/router'
import store from './store/index'
import VueLazyload from 'vue-lazyload'
import IconSvg from '/components/IconSvg'
import registryAlert from '/components/alert/alert'
import registryToast from '/components/toast/toast'
import RegistryLoading from '/components/loading/loading'
import '/assets/style/reset.css'

Vue.config.productionTip = false
//全局注册icon-svg
const request = require.context('/assets/icon', false, /\.svg$/)
request.keys().forEach(request)
Vue.component('icon-svg', IconSvg)

Vue.use(registryAlert)
Vue.use(registryToast)
Vue.use(RegistryLoading)
Vue.config.productionTip = false
fastClick.attach(document.body)
//懒加载
// Vue.use(VueLazyload, {
//   loading: require('common/images/default.jpg')
// })

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')