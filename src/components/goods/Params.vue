<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!--卡片视图区域-->
    <el-card>

      <!--头部的警告区域-->
      <!--show-icon 图标    closable 是否可以关闭-->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>


      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类&nbsp;:&nbsp; </span>
          <!--选择商品分类的级联选择框-->
          <!--:options="cateList"  绑定数据源-->
          <!--:props="cascaderProps"  级联选择框的配置对象-->
          <!--v-model  (选中项绑定值)   必须绑定到一个数组里面-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
            >
          </el-cascader>

        </el-col>

      </el-row>


      <!--tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">

        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <!--添加参数的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <!--展开行列-->
            <el-table-column type="expand">
              <!--展开内容-->
              <template #default="scope">
                <!--循环渲染Tag标签-->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable  @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>

                <!--输入的文本框-->
                <!--v-if 与 v-model 绑定的是当前这一行的inputVisible与inputValue-->
                <!--当前这一行的inputVisible与inputValue  是在获取参数列表数据里面的遍历数组哪里添加的-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加的按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>

            </el-table-column>

            <!--索引列-->
            <el-table-column type="index" label="#">
            </el-table-column>

            <!--参数名称列-->
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>

            <!--操作列-->
            <el-table-column label="操作">
              <!--#opt="opt"   等于 v-slot:opt="opt"-->
              <template v-slot:default="edi">
                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(edi.row.attr_id)">编辑</el-button>
                <el-button type="danger"  icon="el-icon-delete" size="mini" @click="removeParams(edi.row.attr_id)">删除</el-button>
              </template>



            </el-table-column>
          </el-table>



        </el-tab-pane>

        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <!--添加属性的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--展开行列-->
            <el-table-column type="expand">
              <!--展开内容-->
              <template #default="scope">
                <!--循环渲染Tag标签-->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable  @close="handleClose(i,scope.row)">
                  {{item}}
                </el-tag>

                <!--输入的文本框-->
                <!--v-if 与 v-model 绑定的是当前这一行的inputVisible与inputValue-->
                <!--当前这一行的inputVisible与inputValue  是在获取参数列表数据里面的遍历数组哪里添加的-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加的按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>





            </el-table-column>

            <!--索引列-->
            <el-table-column type="index" label="#">
            </el-table-column>

            <!--参数名称列-->
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>

            <!--操作列-->
            <el-table-column label="操作">
              <!--#opt="opt"   等于 v-slot:opt="opt"-->
              <template v-slot:default="edi">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(edi.row.attr_id)">编辑</el-button>
                <el-button type="danger"  icon="el-icon-delete" size="mini" @click="removeParams(edi.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>


          </el-table>

        </el-tab-pane>

      </el-tabs>






    </el-card>



    <!--添加参数的对话框-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>


    <!--修改参数的对话框-->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>





  </div>
</template>

<script>
export default {
  name: 'Params',
  data(){
    return{
      //保存请求过来的商品分类数据
      cateList:[],

      //级联选择框的配置对象
      cascaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',//把选中的id当做值
        label:'cat_name',//所看到的值
        children:'children',//指定选项的子选项为选项对象的某个属性值
      },
      //级联选择框双向绑定到的数组
      selectedCateKeys:[],
      //被激活的页签名称
      activeName:'many',
      //保存动态参数的数据
      manyTableData:[],
      //保存静态参数的数据
      onlyTableData:[],
      //控制添加参数对话框的显示与隐藏
      addDialogVisible:false,
      //添加参数的表单数据对象
      addForm:{
        attr_name:''
      },
      //添加的表单验证规则对象
      addFormRules:{
        attr_name:[
          {
            required:true,message:'请输入参数名称',trigger:'blur'
          },
        ],
      },
      //编辑对话框的显示与隐藏
      editDialogVisible:false,
      //编辑的表单数据对象
      editForm:{

      },
      //编辑的表单验证规则对象
      editFormRules:{
        attr_name:[
          {
            required:true,message:'请输入参数名称',trigger:'blur'
          },
        ],
      },
      //控制按钮与文本框的切换显示
      inputVisible:false,
      //文本框中输入的内容
      inputValue:'',

    }
  },

  created () {
    //获取所有的商品分类列表
    this.getCateList()
  },

  methods:{

    //获取所有的商品分类列表
    async getCateList () {
      //发起请求
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类数据失败')
      }
      //将请求的数据保存在一个空数组里面
      this.cateList = res.data

    },

    //级联选择框选中项发生变化，会触发这个函数   回函参数是:选中节点的值
    handleChange(){
      //调用函数得到请求的数据
      this.getParamsData()

    },

    //tab 页签点击事件的出来函数
    handleTabClick(){
      //调用函数得到请求的数据
      this.getParamsData()
    },

    //获取参数的列表数据
    async getParamsData(){
      //说明选中的不是三级分类
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []//如果不是三级分类，将所选中的值清空
        this.manyTableData = []//如果不是三级分类，将动态参数的数据清空
        this.onlyTableData = []//如果不是三级分类，将静态属性的数据清空
        return
      }
      //根据所选的分类的id，和当前所处的目标去发起请求 获取对应的参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{//参数传递的是当前所激活的参数
          sel:this.activeName
        }
      })

      if(res.meta.status !== 200){
        return this.$message.error('获取参数列表失败')
      }
      //遍历数组  将里面的空字符截取
      res.data.forEach(item => {
        //用三目运算符解决attr_vals为空字符串
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]

        //控制文本框的显示与隐藏
        item.inputVisible = false
        //文本框中输入的值
        item.inputValue = ''

      })


      if(this.activeName === 'many'){
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
    },


    //监听添加对话框的关闭事件
    addDialogClosed(){
      //重置表单
      this.$refs.addFormRef.resetFields()
    },

    //点击添加按钮 发送添加请求
    addParams(){
      this.$refs.addFormRef.validate(async valid => {
        if(!valid)return//预验证失败

        //验证成功 发送请求
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName,
        })
        if(res.meta.status !== 201){
          return this.$message.error('添加参数失败')
        }

        this.$message.success('添加参数成功')
        //关闭对话框
        this.addDialogVisible = false
        //刷新参数的列表数据
        this.getParamsData()
      })

    },

    //点击编辑按钮
    async showEditDialog(attr_id){
      // 根据ID去查询参数      params :传递参数

      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{attr_sel:this.activeName}
      })
      if(res.meta.status !== 200 ){
        return this.$message.error('获取参数信息失败')
      }
      //获取参数成功后把参数保存
      this.editForm = res.data



      this.editDialogVisible = true
    },

    //关闭编辑对话框触发这个函数
    editDialogClosed(){
      //重置表单
      this.$refs.editFormRef.resetFields()

    },

    //点击编辑里面的确定按钮
    editParams(){
      this.$refs.editFormRef.validate(async valid => {
        if(!valid)return
        //预校验成功  发起修改请求 后面跟上请求体
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName
        })
        //如果请求状态码不等于200 说明请求失败
        if(res.meta.status !== 200){
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        //关闭对话框
        this.editDialogVisible = false
        //刷新参数的列表数据
        this.getParamsData()

      })
    },

    //点击删除按钮   根据id去删除对应的参数项
    async removeParams(attr_id){
      const result = await this.$confirm('此操作将永久删除该'+this.titleText+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户取消了删除的操作
      if(result !== 'confirm'){
        return this.$message.info('取消删除')
      }

      //删除的业务逻辑
      const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if(res.meta.status !== 200){
        return this.$message.error('删除'+this.titleText+'失败')
      }
      this.$message.success('删除'+this.titleText+'成功')
      //刷新参数列表
      this.getParamsData()


    },

    //当输入框失去焦点后或者按下回车后触发这个函数
    async handleInputConfirm(row){
      //如果输入的 这一行的值去除空格后的长度等于0，说明没有输入或者输入的是空格
      if(row.inputValue.trim().length === 0){
        //将这一行的值重置为空字符串
        row.inputValue = ''
        //将这一行的input输入框隐藏
        row.inputVisible = false
        return
      }
      //如果前面没有return  说明输入的是有效内容，则需要做后续处理
      row.attr_vals.push(row.inputValue.trim())//将输入的值push到attr_vals里面去
      row.inputValue = ''//将这一行的值重置为空字符串
      row.inputVisible = false//将这一行的input输入框隐藏
      console.log(row)
      //需要发起请求将输入的值保存在数据库中
      this.saveAttrVals(row)



    },

    //将对 attr_vals的操作  保存到数据库中
    async saveAttrVals(row){
      //需要发起请求 将输入的值保存在数据库中
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        })
      if(res.meta.status !== 200){
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')


    },




    //点击按钮展示文本输入框
    showInput(row){
      console.log(row)
      row.inputVisible = true
      //让文本框自动获得焦点
      /*this.$nextTick(_ => {
         this.$refs.saveTagInputRef.$refs.input.focus();
      });*/
      //$nextTick方法 当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(function (){
         return this.$refs.saveTagInputRef.$refs.input.focus();
      })

    },

    //展开列里面的删除按钮  删除对应的参数可选项
    handleClose(i,row){
      /*根据索引号i 去删除一项   删除自己*/
      row.attr_vals.splice(i,1)
      //splice 会修改原数组
      this.saveAttrVals(row)
    },



  },

  computed:{

    //如果按钮需要被禁用则返回true。否则返回false
    isBtnDisabled(){
      //如果所选中的值里面的数组长度等于3 说明是选中的三级分类 则返回false 开启按钮
      //如果所选中的值里面的数组长度不等于3 说明没有选中 三级分类 则返回true 禁用按钮
      return this.selectedCateKeys.length !== 3;

    },

    //当前选中的三级分类的id
    cateId(){
      //如果选中了的数组长度等于3  就返回出去最后一个数组
      if(this.selectedCateKeys.length === 3){
        return this.selectedCateKeys[this.selectedCateKeys.length-1]
      }
      return null
    },

    //动态计算标题的文本
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    },



  },
}
</script>

<style lang="less" scoped>

/*面包屑样式*/
.el-card{
  box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;

}

.cat_opt{
  margin: 15px 0;
}
.el-tag,.el-button,.el-input{
  margin: 10px;
}
.el-tag:nth-child(1){
 margin-left: 48px;
}

.input-new-tag{
  width: 120px;
}

</style>
