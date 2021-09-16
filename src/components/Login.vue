<template>
  <div class="login_container">
    <div class="login_box">
      <!--      头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <!--登录表单区域-->
      <el-form  label-width="0px" class="login_form"
                :model="loginForm" :rules="loginFormRules"
                ref="loginFormRef"
      >

        <!-- 用户名字-->
        <el-form-item prop="username"><!--prop="username"  绑定验证规则-->
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" ></el-input>
        </el-form-item>

        <!--登录密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password">
          <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="logins">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>



      </el-form>


    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return{
      loginForm:{
        username:'admin',
        password:'123456',
      },
      /*用户与密码的验证规则对象*/
      loginFormRules: {
        //验证用户名字是否合法
        username:[
          //required: true （必填项）     message（提示消息）   trigger（触发时机）
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
      },

    }
  },

  methods:{
    //点击重置按钮，重置登录表单
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    //点击登录按钮去验证
    logins(){
      //validate(回调函数，返回一个布尔值)
      this.$refs.loginFormRef.validate(async valid => {
        //当valid为false
        if(!valid) return;
        //当valid为true      {data:res }是对象解构  用post去请求 里面跟要请求的路径   this.loginForm 是表单数据
        const {data:res }=await this.$http.post('login',this.loginForm)
       //如果状态码不等于200 就是登录失败了
        if(res.meta.status !== 200) return this.$message.error('登录失败')
        //状态码等于200登录成功  用了弹框提示
        this.$message.success('登录成功')


        //将登录成功的之后的token保存到客户端的sessionStorage中，这里为了项目中除了登录之外的API接口，必须在登录之后才能访问
        //token只应在当前网站打开期间生效。所以将token保存在sessionStorage中
        console.log(res)
        window.sessionStorage.setItem("token",res.data.token)
        //通过$router 跳转到后台主页
        this.$router.push('/home')
      })
    }
  }

}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
/*form表单*/
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
/*头像*/
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

/*用户与密码样式*/
.login_form{
  position:absolute;
  bottom:0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}


/*按钮*/
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
