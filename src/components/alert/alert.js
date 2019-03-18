import alert from './Alert.vue'
import Vue from 'vue'
let currentMsg = null

const AlertConstructor = Vue.extend(alert)

const createInstance = () => {
  return new AlertConstructor({
    el: document.createElement('div')
  })
}

const Alert = (options) => {
  let instance = createInstance()
  for (let key in options) {
    instance[key] = options[key]
  }
  // instance.showCancelBtn = !!options.cancelBtnText
  // instance.showConfirmBtn = !!options.confirmBtnText

  instance.$watch('visible', function (val) {
    if (!val) {
      instance.$destroy(true)
      instance.$el.parentNode.removeChild(instance.$el)
      instance = null
      currentMsg = null
    }
  })

  instance.callback = action => {
    instance.visible = false
    if (action === 'confirm') {
      currentMsg.resolve('confirm')
    } else {
      currentMsg.reject('cancel')
    }
  }

  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })
  return new Promise((resolve, reject) => {
    currentMsg = {
      resolve,
      reject
    }
  })
}


export default function registryAlert() {
  Vue.prototype.$alert = Alert
}