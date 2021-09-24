<template>


  <el-container class="home-container">

    <!--头部-->
    <el-header >
     <!-- 左边图片文字-->
      <div>
        <img src="../assets/img/heima.png" alt="">
        <span>后台管理系统</span>
      </div>

      <!--右边按钮-->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>



   <!-- 页面主体区域-->
    <el-container>

      <!--侧边栏-->
      <el-aside :width="asideWidth">

        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <!--侧边栏菜单区域-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          :unique-opened="true"
          :collapse="isShow"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          active-text-color="#409EFF">
          <!--:default-active="activePath"   当前激活菜单的 index 是否高亮显示  -->
          <!--:router="true"    是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
          <!--:collapse-transition="false"    是否开启折叠动画-->
          <!--:unique-opened="true"     是否只保持一个子菜单的展开   -->
          <!--active-text-color="#ffd04b" 激活了的文本颜色-->

          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">

            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
               <!--文本-->
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
                          :key="subItem.id" @click="saveNavState('/'+subItem.path)">

              <!--二级菜单模板区域-->
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>

                <!--文本-->
                <span>{{subItem.authName}}</span>
              </template>

            </el-menu-item>


          </el-submenu>

        </el-menu>



      </el-aside>



      <!--右侧内容主体-->
      <el-main>
         <!-- 路由占位符-->
        <router-view></router-view>

      </el-main>
    </el-container>


  </el-container>

</template>

<script>
export default {
  name: 'Home',
  data(){
    return{
      menuList:[],//保存请求过来的左侧菜单数据
      iconsObj:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao',
      },
      isShow:false,//是否折叠
      activePath:'',//被激活的链接地址
    }
  },
  created () {
    this.getMenuList()
    //在创建后 从浏览器里面取出activePath
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  computed:{
    asideWidth(){
      return this.isShow ? '64px' :'200px'
    }
  },
  methods:{
    logout(){
      //退出功能的实现   当点击退出按钮后 清空token 并且跳转到登录页面重新登录
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    //请求所有的菜单数据
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')

      //如果登录状态码不是200 就返回错误信息
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },

    //切换按钮的重叠与展开
    toggleCollapse(){
      this.isShow = !this.isShow
    },
    //保存链接的激活状态 把当前点击的路径传入进来
    saveNavState(activePath){
      //保存在浏览器里面
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }

  },


}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}

.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}


.el-aside{
  background-color: #333744;
  .el-menu{
    border: none;
  }

}
.el-main{
  background-color: #eaedf1;
}

/*左侧菜单的图标*/
.iconfont{
  margin-right: 10px;
}
/*左边菜单上面的折叠*/
.toggle-button{
  color: #fff;
  background-color: #4A5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;/*属性增加或减少字符间的空白*/
  cursor: pointer;
}
</style>
