import toast from './Toast.vue'
import Vue from 'vue'
let instance = null
const ToastConstructor = Vue.extend(toast)

const Toast = (msg, pay = false, duration = 1500) => {
	if (instance) return;
	instance = new ToastConstructor({
		el: document.createElement('div')
	})
	instance.msg = msg,
		instance.pay = pay
	document.body.appendChild(instance.$el)
	Vue.nextTick(() => {
		instance.visible = true
		setTimeout(() => {
			instance.hide()
		}, duration)
	})
}

ToastConstructor.prototype.hide = function () {
	this.visible = false
	this.$destroy(true)
	this.$el.parentNode.removeChild(this.$el)
	instance = null
}

export default function registryToast() {
	Vue.prototype.$toast = Toast
}