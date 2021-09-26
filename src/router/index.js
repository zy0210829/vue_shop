import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login,
  },
  {
    path:'/home',
    component: Home,
    redirect: '/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome,
      },
      {
        path:'/users',
        component: User,
      },
      {
        path:'/rights',
        component: Rights,
      },
      {
        path:'/roles',
        component:Roles,
      },
      {
        path:'/categories',
        component:Cate,
      },

    ]
  },
]

const router = new VueRouter({
  routes
})


//挂载路由导航守卫

router.beforeEach((to,from,next) => {
  //to  将要访问的路径
  //from  代表从那个路径跳转而来
  //next  是一个函数，表示放行
  //next()  放行  next('/login') 强制跳转


  //如果用户访问的是登录页面，直接放行
  if(to.path ==='/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //如果token没有值，就说明没有登录 就强制跳转到login页面
  if(!tokenStr)return next('/login')
  //如果token有值  直接放行
  next()
})
export default router
