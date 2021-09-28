import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

/*导入全局样式表*/
import './assets/css/global.css'
/*导入字体图标*/
import './assets/fonts/iconfont.css'

/*导入富文本编辑器*/
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme



/*导入axios*/
import axios from 'axios'
//axios的默认请求路径地址
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
//请求拦截器
axios.interceptors.request.use( config =>{
  //为请求头对象添加了token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

//导入插件TreeTable
import TreeTable from 'vue-table-with-tree-grid'
//全局注册
Vue.component('tree-table',TreeTable)
//将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)




//全局过滤器
//Vue.filter(过滤器的名字，处理函数)
Vue.filter('dateFormat',function (originVal){

  const date = new Date(originVal * 1000)
  const year = date.getFullYear()
  //padStart(总长度，不足多少位用什么字符串来填充)
  const month = (date.getMonth() + 1+'').padStart(2,'0')
  const day = (date.getDay() + '').padStart(2,'0')
  const hour = (date.getHours() + '').padStart(2,'0')//后面加空字符串是将这个转化为字符串
  const minute = (date.getMinutes() + '').padStart(2,'0')
  const second = (date.getSeconds() + '').padStart(2,'0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})





/*在vue的原型里面添加全局http*/
Vue.prototype.$http=axios




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
