<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->

      <el-card>
        <!--搜索与添加区域-->
        <!--:gutter="30"   间距-->
        <el-row :gutter="30">
          <!--搜索区域    :span="8" 宽度 -->
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <!--添加用户区域-->
          <el-col :span="4">
            <el-button type="primary" @click="isShow=true">添加用户</el-button>
          </el-col>
        </el-row>

        <!--用户列表区域-->
        <el-table :data="userList" :border="true" stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <!--作用域插槽-->
            <template slot-scope="scope">
              <!--{{scope.row}} 拿到这一行的数据  v-model绑定的是一个布尔值 -->
              <el-switch  v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!--删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              <!--分配角色按钮-->
              <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
              </el-tooltip>

            </template>
          </el-table-column>
        </el-table>

        <!--分页区域-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

      </el-card>

    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="isShow"
      @close="addDialogClosed"
      width="50%">
      <!--内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" status-icon>
                                <!--prop="username  是校验规则-->
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="addForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click=" isShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户对话框"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="50%">

      <!--内容主体区域-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>


    <!--分配角色的对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose"
      >
      <div>
        <p>当前的用户 : {{userInfo.username}}</p>
        <p>当前的角色 : {{userInfo.role_name}}</p>
        <p>分配新角色 :
          <!--:value="item.id" 表示实际所选中的   -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>




  </div>




</template>

<script>
export default {
  name: 'User',
  data(){

    //验证手机号的规则
    let checkMobile = (rule,value,cb) => {
      //验证手机号的正则表达式
      let phone=value.replace(/\s/g,"")
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(value.length ===0){
        cb();
      }else{
        if(!regMobile.test(phone)){
          cb(new Error('请输入合法的手机号'))
        }else{
          cb()
        }
      }

    };

    return{
      //获取用户列表的参数对象
      queryInfo:{
        query:'',
        pagenum:1,//当前的页数
        pagesize:5,//当前每页显示多少条数据
      },
      //添加表单的验证规则对象
      addFormRules:{

        //用户名的校验规则
        username:[
          {
            required:true,
            message:'请输入用户名',
            trigger:'blur'
          },
          {
            min:4,
            max:10,
            message: '用户名的长度在4~10个字符之间',
            trigger:'blur',
          },
        ],

        //密码的校验规则
        password:[
          {
            required:true,
            message:'请输入密码',
            trigger:'blur'
          },
          {
            min:6,
            max:16,
            message: '用户名的长度在6~16个字符之间',
            trigger:'blur',
          },
        ],

        //邮箱的校验规则
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],

        //手机的校验规则
        mobile:[
          { required: true, message: '手机不能为空'},
          { validator:checkMobile, message: '请输入合法的手机号',trigger:'blur'}
        ],
      },

      //编辑用户对话框里面的表单验证规则
      editFormRules:{
        //邮箱的校验规则
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],

        //手机的校验规则
        mobile:[
          { required: true, message: '手机不能为空'},
          { validator:checkMobile, message: '请输入合法的手机号',trigger:'blur'}
        ],
      },
      userList:[],//保存请求的用户数据列表
      total:0,//保存总页数,
      isShow:false,//控制添加用户对话框的显示与隐藏
      addForm:{//添加用户的表单数据
        username: '',//保存v-model的值
        password: '',
        email:'',
        mobile:'',
      },
      editDialogVisible:false,//控制编辑用户的对话框的显示与隐藏
      editForm:{},//保存查询到的用户信息对象
      setRoleDialogVisible:false,//控制分配角色对话框的显示与隐藏
      userInfo:{},//需要被分配角色的用户信息
      rolesList:[],//所有角色的数据列表
      selectedRoleId:'',//已选中的角色id值
    }
  },
  created () {
    this.getUserList()
  },
  methods:{
    //请求用户列表的数据
    async getUserList(){
      const {data:res} = await this.$http.get('users',{
        params:this.queryInfo
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total


    },

    //监听pagesize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    //监听页码值发生改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    // 监听switch 开关状态的改变 并且保存在数据库中
    async userStateChanged(userinfo){
      //            users/:uld/state/:type   其中:uld  和:type  不能为空
      const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !== 200){
        //如果更新失败就还原页面的 mg_state 状态
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message({
        type:'success',
        message:'更新用户状态成功',
        duration:1000,//显示时间
        center:true,
      })
    },

    //监听添加用户对话框的关闭事件
    addDialogClosed(){
      //重置
      this.$refs.addFormRef.resetFields()
    },

    //点击按钮，添加新用户
    addUser(){
      // 点击确定后 预解析 看里面是否验证通过 全部通过则返回true
      this.$refs.addFormRef.validate(async valid => {
        //如果验证不通过 ，就直接返回出去
        if(!valid) return
        //如果通过后则发起添加用户的网络请求
        const {data:res} = await this.$http.post('users',this.addForm)
        //如果请求后的状态码不等于201  就说明请求失败了
        if(res.meta.status !== 201){
          this.$message.error('添加用户失败')
        }
        this.$message.success({
          type:'success',
          message:'更新用户状态成功',
          duration:1000,//显示时间
          center:true,
        })
        //隐藏添加用户的对话框
        this.isShow = false
        //重新获取用户的列表
           this.getUserList()
      })
    },

    //展示编辑的对话框
    async showEditDialog(id){
      //显示对话框
      this.editDialogVisible = true

      //通过id去请求数据
      const {data:res} = await this.$http.get('users/'+ id)
      if(res.meta.status !==200){
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data

    },

    //监听用户对话框的关闭事件
    editDialogClosed(){
      //重置
      this.$refs.editFormRef.resetFields()
    },

    //修改用户信息并提交
    editUserInfo(){
      //validate() 是表单验证的方法，参数为一个回调函数，该回调函数会在校验结束后被调用，
      // 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.editFormRef.validate(async valid => {
        if(!valid){
          return this.$message.error('格式错误')
        }
        //如果校验成功，就发起修改用户信息的数据请求
        const {data:res} = await this.$http.put('users/'+this.editForm.id,{
          //把修改后的值保存在数据库中的email
          email:this.editForm.email,
          mobile:this.editForm.mobile,
        })
        //如果状态码不是200 就说明请求失败
        if(res.meta.status !== 200){
          return this.$message.error('编辑失败')
        }

        //编辑成功后关闭对话框
        this.editDialogVisible = false
        //重新请求数据
        this.getUserList()
        //更新用户成功
        this.$message.success('更新用户成功')




      })
    },

    //弹框询问用户是否删除用户信息
    async removeUserById(id){
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      //如果用户确认删除，则返回的值为字符串 confirm
      //如果用户取消，则返回的值为字符串  cancel

      //如果不为字符串 confirm  就说明用户取消了
      if(result !== 'confirm'){
        return this.$message.info('已取消删除')
      }

      //请求输出用户信息
      const {data:res} = await this.$http.delete('users/'+id)
      //如果请求失败
      if(res.meta.status !== 200){
        return this.$message.error('删除用户信息失败')
      }
      //请求成功
      this.$message.success('删除用户信息成功')
      //重新加载数据
      this.getUserList()

    },

    //展示分配角色的对话框
    async setRole(userInfo){
      //保存用户信息
      this.userInfo = userInfo

      //在展示对话框之前。获取所使用角色的列表
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error('请求角色列表失败')
      }
      //请求成功后就把这个数据保存起
      this.rolesList = res.data


      //显示对话框
      this.setRoleDialogVisible = true
    },

    //点击确定按钮，分配角色
    async saveRoleInfo(){
      //因为this.selectedRoleId默认为空 就为false  就取反  说明没有选择
      //如果用户选择了后 this.selectedRoleId 就有值 就为ture
      if(!this.selectedRoleId){//没有选择
        return this.$message.error('请选择要分配的角色')
      }

      //如果用户选择了  ${this.userInfo.id}:表示当前用户的id   请求体表示当前所选择的角色id
      /*console.log(this.selectedRoleId)*/
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status!== 200){
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },

    //监听分配角色对话框的关闭事件
    setRoleDialogClose(){
      this.selectedRoleId = ''//清空选中的角色id值
      this.userInfo = {}//清空当前的角色信息
    },



  },
}
</script>

<style lang="less" scoped>

.el-card{
  box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;

}

</style>
