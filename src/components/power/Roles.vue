<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>

      <!--添加角色按钮-->
      <el-row>
        <el-col :span="4">
        <el-button type="primary" @click="addButton">添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色列表区域-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">

            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"  :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter']">

              <!--渲染一级权限-->
              <el-col :span="7">
                <el-tag class="one" closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!--渲染二级和三级权限-->
              <el-col :span="17">
                <!--通过for循环嵌套渲染二级权限-->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop','vcenter']" >

                  <!--二级权限-->
                  <el-col :span="8">
                    <el-tag type="success" class="two"
                            closable @close="removeRightById(scope.row,item2.id)">
                       {{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--三级权限-->
                  <el-col :span="16">
                    <el-tag type="warning"
                            v-for="item3 in item2.children"
                            :key="item3.id" :class="['three']"
                            closable @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}</el-tag>
                  </el-col>
                </el-row>

              </el-col>

            </el-row>


          </template>
        </el-table-column>

        <!--索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="200px"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色id" prop="id" width="100px"></el-table-column>
        <el-table-column label="操作" width="350px">

          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showRolesEditDialog(scope.row)">编辑</el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
            <!--分配角色按钮-->
                <!--tooltip文字提示功能  effect属性来改变主题，默认为dark   placement 显示位置 鼠标是否可进入到 tooltip 中，默认为true -->
            <el-tooltip  effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>

          </template>

        </el-table-column>
      </el-table>


    </el-card>


    <!--添加角色对话框-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialog"
      width="50%"
      @close="addDialogClose"
      >

      <el-form  :model="addForm"  :rules="addRoleRules"  ref="fromRoleRef" label-width="80px">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>




    <!--编辑修改角色的对话框-->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesDialogVisible"
      width="50%">

      <!--内容主体区域-->
      <div>
        <!--当前信息-->
        <p class="ediStyle">当前信息&nbsp;:&nbsp;</p>
        <p>当前的角色名称&nbsp;:&nbsp;{{rolesInfo.roleName}}</p>
        <p>当前的角色描述&nbsp;:&nbsp;{{rolesInfo.roleDesc}}</p>

        <!--进行操作-->
        <p class="ediStyle">进行操作&nbsp;:&nbsp;</p>
        <!--角色名称-->
        <div class="ediRoles">
          <div>
          <p>修改的角色名称&nbsp;:&nbsp;</p>
          </div>
          <!--选择框-->
          <div class="ediRoles_right">
            <!--:value="item.id" 表示实际所选中的   -->
            <el-select v-model="selectedRole.roleName" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.roleName">
              </el-option>
            </el-select>
          </div>
        </div>

        <!--角色描述-->
        <div class="ediRoles">
          <div class="ediRoles_left">
            <p>修改的角色描述&nbsp;:&nbsp;
            </p>
          </div>
          <!--描述框-->
          <div class="ediRoles_text">

              <el-form>
                <el-form-item  prop="roleDesc">
                  <el-input type="textarea" :row="2" v-model="selectedRole.roleDesc" placeholder="请输入内容" ></el-input>
                </el-form-item>
              </el-form>

          </div>


        </div>
      </div>



      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickRoles">确 定</el-button>
      </span>
    </el-dialog>













    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
      >
      <!--树形控件  :data 数据源 node-key每个树节点用来作为唯一标识的属性，  default-expand-all默认展开所有节点   -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <!--按钮区域-->
      <span slot="footer" class="dialog-footer">
         <!--取消按钮-->
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
         <!--确认按钮-->
        <el-button type="primary"  @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Roles',
  data(){

    return{
      //所有角色列表数据
      roleList:[],
      //分配权限的对话框显示与隐藏
      setRightDialogVisible:false,
      //保存所有权限的数据
      rightsList:[],
      //树形控件的属性绑定对象
      treeProps:{
        label:'authName',//指定节点标签为节点对象的某个属性值
        children:'children',//指定子树为节点对象的某个属性值
      },
      //保存默认选中的节点Id值
      defKeys:[],
      //当前即将分配权限的角色id
      roleId:'',
      //添加角色对话框的显示与隐藏
      addDialog:false,
      addForm:{//添加用户的表单数据
        roleName: '',//保存角色名称
        roleDesc:'',//保存角色描述
      },
      addRoleRules:{
        //角色名的校验规则
        roleName:[
          {
            required:true,
            message:'请输入角色名字',
            trigger:'blur'
          },
          {
            min:2,
            max:10,
            message: '用户名的长度在2~10个字符之间',
            trigger:'blur',
          },
        ],
        //角色描述的校验规则
        roleDesc:[
          {
            required:false,
            message:'请输入角色描述',
            trigger:'blur'
          },
          ]

      },
      //修改角色对话框
      editRolesDialogVisible:false,
      //保存当前的角色信息
      rolesInfo:'',
      rolesList:[],//所有角色的数据列表

      //保存修改的值
      selectedRole:{
        roleName:'',//已选中的角色值
        roleDesc:'',//描述内容
      },
      rolesId:'',

    }
  },
  created () {
    this.getRolesList()
  },

  methods:{
    //获取所有的角色列表
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error('角色列表获取失败')
      }
      this.roleList = res.data

    },

    //根据id删除对应的权限  传入角色ID 传入权限ID
    async removeRightById(role,rightId){
      //弹框提示用户是否删除
      //$confirm  是一个promise  成功了会返回出去一个字符串confirm
      const confirmResult = await this.$confirm('此操作将删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch( err => err)

      //如果用户点击取消了
      if(confirmResult !== 'confirm'){
        return this.$message.info('取消删除')
      }

      //点击确认后  发送删除请求
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      //判断是否删除成功
      if(res.meta.status !== 200){
        return this.$message.error('删除权限失败')
      }
      //删除成功  返回的data, 是当前角色下最新的权限数据
      //role.children  是这一行的一级权限
      role.children = res.data

    },

    //展示分配权限的对话框   传入当前的角色
    async showRightDialog(role){
      //保存角色ID
      this.roleId = role.id

      //获取所有权限的数据
      const {data:res} = await this.$http.get('rights/tree')
        //获取所有权限数据失败
        if(res.meta.status !== 200){
          return this.$message.error('获取权限数据失败')
        }

        //递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)

        //把获取到的权限保存在rightsList中
        this.rightsList = res.data


      //显示对话框
      this.setRightDialogVisible = true
    },

    //通过递归的方式获取角色下所有三级权限的id，并且保存在defKeys数组中
    getLeafKeys(node,arr){
      //如果node节点不包含children属性  就是三级节点
      if(!node.children){//如果是三级节点

        return arr.push(node.id)//就把当前的id加入到数组里面
      }

      //如果不是三级节点  遍历node.children ，
      //每循环一下 拿到一个子节点item   对这个item再次调用递归函数
      node.children.forEach(item => this.getLeafKeys(item,arr))

    },

    //监听分配权限对话框的关闭事件
    setRightDialogClose(){
      //对话框关闭就重置defKeys数组
      this.defKeys = []
    },

    //点击确定按钮  为角色分配权限
    async allotRights(){
      const keys = [
        //下面是ELM UI组件tree树形控件自带的方法
        // getCheckedKeys()  若节点可被选择,返回目前被选中的节点的 key 所组成的数组
        // getHalfCheckedKeys()  若节点可被选择,返回目前半选中的节点的 key 所组成的数组
        // ...是扩展运算符 将运算符后面的变量里东西每一项拆下来 这里用来合并数组，
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),

      ];
      //以逗号拼接数组
      const idStr = keys.join(',')

      //发送网络请求  把请求体idStr 发送到后端去    ${this.roleId} 表示角色的id
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      console.log(res)
      if(res.meta.status !== 200){
        return this.$message.error('分配权限失败')
      }

      this.$message.success('分配权限成功')
      //如果成功  就重新渲染页面
      this.getRolesList()
      //关闭对话框
      this.setRightDialogVisible = false
    },

    //添加角色按钮
     addButton(){
      this.addDialog = true
    },

    //确定按钮
    addRole(){
      /*  validate  对整个表单进行校验的方法，参数为一个回调函数。
      该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
      若不传入回调函数，则会返回一个 promise*/
      this.$refs.fromRoleRef.validate( async valid => {
        /*console.log(valid)   布尔值 校验通过为true 不通过为false*/
        //如果验证不通过 ，就直接返回出去
        if(!valid) return
        //如果通过后则发起添加用户的网络请求   把addForm对象传入出去
        const {data:res} = await this.$http.post('roles',this.addForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')

        //隐藏对话框
        this.addDialog = false
        this.getRolesList()

      })


    },

    //监听添加角色对话框的关闭
    addDialogClose(){
      //重置表单
      this.$refs.fromRoleRef.resetFields()
    },

    //修改角色对话框
    async showRolesEditDialog(rolesInfo){
      //保存当前角色的信息
      this.rolesInfo = rolesInfo

      //在展示对话框之前。获取所使用角色的列表
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error('请求角色列表失败')
      }
      //请求成功后就把这个数据保存起
      this.rolesList = res.data
      //显示对话框
      this.editRolesDialogVisible = true
    },

    //点击修改用户里面的确定按钮
    async clickRoles(){
      //因为this.selectedRoleId默认为空 就为false  就取反  说明没有选择
      //如果用户选择了后 this.selectedRoleId 就有值 就为ture
      if(!this.selectedRole.roleName){//没有选择
        return this.$message.error('没有选择要修改的角色')
      }

      const {data:res} = await this.$http.put(`roles/${this.rolesInfo.id}`,this.selectedRole)
      if(res.meta.status !== 200){
        return this.$message.error('修改角色失败')
      }
      this.$message.success('修改角色成功')

      //关闭对话框
      this.editRolesDialogVisible = false
      //刷新数据
      this.getRolesList()
    },

    //点击删除  根据角色id删除
    async removeRolesById(rolesId){
      this.rolesId = rolesId
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)//catch 捕获错误

      //如果用户确认删除，则返回的值为字符串 confirm
      //如果用户取消，则返回的值为字符串  cancel

      //如果不为字符串 confirm  就说明用户取消了
      if(result !== 'confirm'){
        return this.$message.info('已取消删除')
      }

      const {data:res} = await this.$http.delete(`roles/`+this.rolesId)
      if(res.meta.status !== 200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      //重新渲染页面
      this.getRolesList()
    },

  },
}
</script>

<style lang="less" scoped>
.el-card{
  box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;

}
.one{
  margin: 6px 0 6px 48px;
}
.two{
  margin: 6px 0;
}
.three{
  margin: 6px 5px;
}

.bdtop{
  border-top:1px solid #eee ;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}

.vcenter{
  display: flex;
  align-items:center;
}

.ediRoles{
  display: flex;
}
.ediRoles_left{
  display: flex;
  align-items: center;
}
.ediRoles_right{
  flex: 1;
  display: flex;
  align-items: center;

}
.ediRoles_text{
  flex: 1;
  margin-top: 29px;
}
.ediRoles_text el-form{
  display: flex;
  align-items: center;
}





.ediStyle{
  font-size: 15px;
  font-weight: bold;
  color: #bd2c00;
}

</style>
