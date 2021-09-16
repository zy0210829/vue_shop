import Vue from 'vue'
import { Button } from 'element-ui'

/*按需导入组件*/
import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
//导入弹框提示框  需要全局挂载
import {Message}from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//全局挂载
Vue.prototype.$message =Message
