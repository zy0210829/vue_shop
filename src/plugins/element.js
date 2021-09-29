import Vue from 'vue'
import { Button } from 'element-ui'

/*按需导入组件*/
import {Form,FormItem} from 'element-ui'
import {Input} from 'element-ui'
//导入弹框消息提示框  需要全局挂载
import {Message}from 'element-ui'

import {Container,Header,Aside,Main,Row,Col,Switch,Tooltip,Pagination,Tag} from 'element-ui'

import {Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Table,TableColumn,Dialog,Tree} from 'element-ui'

import {Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,CheckboxGroup,Checkbox,Upload,Timeline,TimelineItem} from 'element-ui'

//导入弹框
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
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


//全局挂载  信息提示框
Vue.prototype.$message = Message
//全局挂载  弹框
Vue.prototype.$confirm = MessageBox.confirm
