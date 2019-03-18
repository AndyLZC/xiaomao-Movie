import loading from './Loading.vue'
import Vue from 'vue'
let instance = null
const LoadingConstructor = Vue.extend(loading)

const Loading = () => {
	return {
		show() {
			if (instance) return
			instance = new LoadingConstructor({
				el: document.createElement('div')
			})
			document.body.appendChild(instance.$el)
			instance.visible = true
		},
		hide() {
			instance.hide()
		}
	}
}

LoadingConstructor.prototype.hide = function () {
	this.visible = false
	this.$destroy(true)
	this.$el.parentNode.removeChild(this.$el)
	instance = null
}

export default function registryLoading() {
	Vue.prototype.$loading = Loading()
}