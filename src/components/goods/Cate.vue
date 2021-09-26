<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>

      <!--添加分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>


      <!--表格区域  TreeTable 新插件-->
        <!--expand-type 是否展开行效果  selection-type 是否为多选类型表格   -->
        <!--   show-index 是否显示数据索引      index-text 数据索引名称        border  是否显示纵向边框 -->
        <!--show-row-hover  鼠标悬停时，是否高亮当前行-->
        <tree-table
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          border
          index-text="#"
          :show-row-hover="false"
          class="treeTable">

          <!--是否有效-->
          <template   v-slot:isOk="isOk">
            <i class="el-icon-success" v-if="isOk.row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-error" v-else  style="color:red"></i>
          </template>

          <!--排序-->
          <template #order="order">
            <el-tag size="mini" v-if="order.row.cat_level === 0 " >一级</el-tag>
            <el-tag type="success" size="mini"  v-else-if="order.row.cat_level === 1 " >二级</el-tag>
            <el-tag type="warning" size="mini"  v-else-if="order.row.cat_level === 2 " >三级</el-tag>
          </template>

          <!--操作-->
          <template #opt="opt">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="ediCateList(opt.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="aa(opt.row.cat_id)">删除</el-button>

          </template>

        </tree-table>


      <!--分页区域-->
      <!--size-change : 表示pageSize 改变时会触发 回调参数是:每页条数 -->
      <!--current-change : 表示currentPage 改变时会触发 回调参数是:当前页-->
      <!--current-page 绑定的是当前页数-->
      <!--page-sizes  每页显示个数选择器的选项设置-->
      <!--page-size  每页显示条目个数 几条一页 -->
      <!--layout 组件布局，子组件名用逗号分隔-->
      <!--total  总条目数-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>


    </el-card>

    <!--添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      width="50%"
      @close="addCateVisibleClosed"
      >

      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               label-width="100px"
               ref="addCateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>


        <!--父级分类可以为空，当为空的时候，就把 上面的分类名称作为一级分类
        当选择了父级分类 表示把 上面的分类名称添加到 当前选中的父级分类之下-->
        <el-form-item label="父级分类" >
          <!--v-model 后面必须是一个数组-->
          <!--:options="parentCateList" 指定数据源-->
          <!--props 用来指定配置对象-->
          <!--clearable清除所选中的-->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            clearable
            @change="parentCateChanged"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

   <!-- 编辑按钮对话框-->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      >

      <el-form :model="ediCateForm" :rules="ediCateFormRules" ref="editRuleFormRef" label-width="100px" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ediCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogInfo">确 定</el-button>
      </span>
    </el-dialog>





  </div>
</template>

<script>
export default {
  name: 'Cate',
  data(){
    return {
      //保存请求的商品分类的数据列表
      cateList:[],
      //查询条件
      queryInfo:{
        type:3,//所有1 、2、3级分类的数据列表
        pagenum:1,
        pagesize:5,
      },
      //保存总数据条数
      total:0,
      //为table指令列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name',//对应列内容的属性名
        },
        {
          label:'是否有效',
          type:'template',//表示将当前列定义为模板列
          template:'isOk',//表示当前这一列使用的模板名称
        },
        {
          label:'排序',
          type:'template',//表示将当前列定义为模板列
          template:'order',//表示当前这一列使用的模板名称
        },
        {
          label:'操作',
          type:'template',//表示将当前列定义为模板列
          template:'opt',//表示当前这一列使用的模板名称
        },
      ],
      //添加分类的对话框的显示与隐藏
      addCateVisible:false,
      //添加分类的表单数据对象
      addCateForm:{
        cat_pid:0,//分类的父ID
        cat_name:'',//分类名称
        cat_level:0,//分类等级 默认添加的是1级分类
      },
      //校验规则
      addCateFormRules:{
        cat_name:[
          {
            required:true,message:'请输入分类名称',trigger:'blur'
          },
        ],

      },
      //保存父级分类的列表
      parentCateList:[],
      //指定级联选择器的配置对象
      cascaderProps:{
        expandTrigger:'hover',//expandTrigger	次级菜单的展开方式
        value:'cat_id',//所选中之后的值  指定选项的值为选项对象的某个属性值
        label:'cat_name',//所看到的分类名字
        children:'children',//通过children来实现嵌套的
        checkStrictly: true,//是否严格的遵守父子节点不互相关联
      },
      //保存选中的父级分类的id数组
      selectedKeys:[],
      //编辑按钮对话框的显示与隐藏
      editDialogVisible:false,
      //编辑按钮的表单数据对象
      ediCateForm:{
        cat_name:'',//保存当前行的名称
        cat_id:0,//保存当前行的id
      },
      //编辑里面的校验规则
      ediCateFormRules:{
        cat_name:[
          {
            required:true,message:'请输入分类名称',trigger:'blur',
          },
        ],
      },


    }
  },



  created () {
    this.getCateList()//获取商品分类的数据

  },
  methods:{

    //获取商品分类的数据
    async getCateList(){

      const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败')
      }
      //把数据列表赋值给cateList
      this.cateList = res.data.result
      //把总数据条数赋值给total
      this.total = res.data.total


    },

    //分页区域

      //监听pagesize的改变
      handleSizeChange(newSize){
        //将新的页面条数 赋值到queryInfo.pagesize里面保存
        this.queryInfo.pagesize = newSize
        //重新请求数据
        this.getCateList()
      },

      //监听pagenum的改变
      handleCurrentChange(newPage){
        //将新的当前页  赋值到queryInfo.pagesize里面保存
        this.queryInfo.pagenum = newPage
        //重新请求数据
        this.getCateList()
      },

    //点击添加分类按钮  展示对话框
    showAddCateDialog(){
      this.getParentCateList()//获取父级分类的数据列表
      this.addCateVisible = true//展示对话框
    },

    //获取父级分类的数据列表  用于级联选择器的数据加载
    async getParentCateList(){
      //获取所有1 、2级分类的数据列表
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status !== 200){
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data


    },

    //选择项发生变化时触发这个函数
    parentCateChanged(){

      //如果selectedKeys数据中的长度大于0  则表示选中了父级分类
      //不大于0就说明没有选中
      if(this.selectedKeys.length > 0){//选中了
        //保存父级分类的最后一个数的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
        //为当前分类的等级赋值   有几个数就是等级几
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{//没有选中
        //保存父级分类的最后一个数的id
        this.addCateForm.cat_pid = 0
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }


    },

    //点击确定按钮   发起请求添加新的分类
    addCate(){
      //validate() 是表单验证的方法，参数为一个回调函数，该回调函数会在校验结束后被调用，
      // 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.post('categories',this.addCateForm)

        //判断状态码
        if(res.meta.status !== 201){
          return this.$message.error('添加新分类失败')
        }
        this.$message.success('添加新分类成功')

        this.getCateList()
        this.addCateVisible = false
      })


    },

    //对话框关闭重置表单
    addCateVisibleClosed(){
      //重置表单
      this.$refs.addCateFormRef.resetFields()

      //重置级联选择器的内容
      this.selectedKeys = []//清空所选中的父级分类的id数组
      this.addCateForm.cat_level = 0//清空当前分类的等级
      this.addCateForm.cat_pid = 0//清空当前父级分类的id

    },

    //编辑按钮对话框
    ediCateList(info){
      //把当前行的名称保存在ediCateForm.cate_name里面  用于默认显示
      this.ediCateForm.cat_name = info.cat_name
      //保存当前行的id   用于发送请求
      this.ediCateForm.cat_id = info.cat_id

      //显示对话框
      this.editDialogVisible = true
    },

    //点击编辑里面的确定按钮后触发
    editDialogInfo(){
      //预解析  里面校验全部通过则返回true
      this.$refs.editRuleFormRef.validate( async valid => {
        //如果为false  就直接返回出去
        if(!valid) return

        //如果为ture  就发起网络请求
        const {data:res} = await this.$http.put(`categories/${this.ediCateForm.cat_id}`,{
          cat_name : this.ediCateForm.cat_name
        })

        if(res.meta.status !== 200){
          return this.$message.error('修改分类名称失败')
        }
        this.$message.success('修改分类名称成功')
        //隐藏对话框
        this.editDialogVisible = false
        //重新渲染数据
        this.getCateList()


      })

    },

    //删除按钮
    async aa(id){
      const  result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if(result !== 'confirm'){//说明点击了取消
        return this.$message({
          type: 'info',
          message: '已取消删除',
          center:true,
        });
      }

      //点击了确定后  发送删除请求
      const {data:res} = await this.$http.delete(`categories/${id}`)
      if(res.meta.status !== 200){
        return this.$message({
          type: 'error',
          message: '删除失败,请重试',
          center:true,
        });
      }

      this.$message({
        type: 'success',
        message: '删除成功',
        center:true,
      });

      this.getCateList()


    },


  },

}
</script>

<style lang="less" scoped>

.treeTable{
  margin-top: 15px;
}

.el-cascader{
  width: 100%;
}
</style>
