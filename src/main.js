import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

/*导入全局样式表*/
import './assets/css/global.css'
/*导入字体图标*/
import './assets/fonts/iconfont.css'
/*导入axios*/
import axios from 'axios'
//axios的默认请求路径地址
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
/*在vue的原型里面添加全局http*/
Vue.prototype.$http=axios




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
