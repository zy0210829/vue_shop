import Vue from 'vue'
import { Button } from 'element-ui'

/*按需导入组件*/
import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
//导入弹框提示框  需要全局挂载
import {Message}from 'element-ui'

import {Container,Header,Aside,Main,Row,Col,Switch,Tooltip,Pagination,Tag} from 'element-ui'

import {Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Table,TableColumn,Dialog,Tree} from 'element-ui'

import {Select,Option} from 'element-ui'
import { MessageBox } from 'element-ui';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)


//全局挂载  信息提示框
Vue.prototype.$message = Message
//全局挂载  弹框
Vue.prototype.$confirm = MessageBox.confirm
