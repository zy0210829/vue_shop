<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>


    <!--卡片视图区域-->
    <el-card>
      <!--提示区域-->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false">
      </el-alert>

      <!--步骤条区域-->
      <!--这里减0 是为了将number装换为字符串-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center class="steps">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--Tab栏区域  el-form 必须在el-tab的上面 -->
      <!--label-position="top" 表单域标签的位置，-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">

        <!--tab-position 选项卡所在位置  当点击第一个tab的时候，将name传入到v-model双向绑定的里面去 -->
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave"  @tab-click="tabClicked">
          <!--基本信息-->
          <el-tab-pane label="基本信息" name="0">

            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" >
              <el-input v-model.number="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" >
              <el-input v-model.number="addForm.goods_number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaaderProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>



          </el-tab-pane>

          <!--商品参数-->
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单的item项-->
            <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals " :key="i" border></el-checkbox>

              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>

          <!--商品属性-->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!--商品图片-->
          <el-tab-pane label="商品图片" name="3">
            <!--action  表示图片要上传到的后台APL地址-->
            <!--on-preview  点击文件列表中已上传的文件时的钩子（就是上传图片后点击预览会触发这个钩子）-->
            <!--handleRemove  点击图片的叉号的时候触发这个钩子-->
            <!--headers   设置上传的请求头部-->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess">

              <el-button size="small" type="primary">点击上传</el-button>

            </el-upload>

          </el-tab-pane>

          <!--商品内容-->
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor
              ref="myQuillEditorRef"
              v-model="addForm.goods_introduce"

            />

            <!--添加商品的按钮-->
            <el-button type="primary" class="btnAdd" @click="addGood">添加商品</el-button>


          </el-tab-pane>

        </el-tabs>
      </el-form>


    </el-card>


    <!--图片预览对话框-->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
      >
      <img :src="previewPath" alt="" class="previewImg">

    </el-dialog>



  </div>
</template>

<script>

import _ from  'lodash'


export default {
  name: 'Add',
  data(){
    return{
      //设置当前激活的步骤
      activeIndex:'0',
      //添加商品的表单数据对象
      addForm:{
        goods_name:'',//商品名称
        goods_price:0,//商品价格
        goods_weight:0,//商品重量
        goods_number:0,//商品数量
        goods_cat:[],//商品所属的分类数组
        pics:[],//图片的数组
        goods_introduce:'',//商品的详情描述
        attrs:[],//商品的参数，包含动态参数与静态参数
      },
      //校验规则
      addFormRules:{
        //商品名称校验规则
        goods_name:[
          {
            required:true,message:'请输入商品名称',trigger:'blur'
          },
        ],
        //商品价格校验规则
        goods_price: [
          {
            required:true,type:'number',message:'请输入正确的商品价格',trigger:'blur'
          },
        ],
        //商品重量校验规则
        goods_weight:[
          {
            required:true,type:'number',message:'请输入正确的商品重量',trigger:'blur'
          },
        ],
        //商品数量校验规则
        goods_number:[
          {
            required:true,type:'number',message:'请输入正确的商品数量',trigger:'blur'
          },
        ],
        //商品分类校验规则
        goods_cat:[
          {
            required:true,message:'请选择商品分类',trigger:'blur'
          },
        ],


      },

      //保存所有商品分类数据
      cateList:[],
      //级联选择框的配置对象
      cascaaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',//把选中的id当做值 (选中的谁的值)
        label:'cat_name',//所看到的值
        children:'children',//指定选项的子选项为选项对象的某个属性值
      },
      //保存请求过来的商品动态参数数据
      manyTableData:[],
      //保存请求过来的商品静态属性数据
      onlyTableData:[],
      //图片上传的路径
      uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
      //因为组件中有自己的请求 所以需要手动指定请求体 图片上传组件的headers请求头对象
      headersObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      //保存上传成功后的图片url地址
      previewPath:'',
      //图片预览对话的显示与隐藏
      previewVisible:false,


    }
  },
  created () {
    this.getCateList()
  },
  methods:{

    //获取所有商品的分类
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败')
      }

      //保存请求过来的所有商品分类数据
      this.cateList = res.data


    },

    /*级联选择框变化会触发这个函数*/
    handleChange(){
      //判断是否选定的是否三级分类
      if(this.addForm.goods_cat.length !==3){
        //如果不是  就把选中的值清空
        this.addForm.goods_cat = []
      }
    },

    //切换标签之前的钩子(标签页的切换触发),若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    //里面2个参数  activeName表示进入的标签页的名称  oldActiveName表示即将离开的标签页的名称
    beforeTabLeave(activeName,oldActiveName){
      //如果当前标签页等于0并且选中的goods_cat数组的长度不是3
      if(oldActiveName === '0'&& this.addForm.goods_cat.length !==3){
        this.$message.error('请先选择商品分类')
        return false//禁止切换
      }


    },

    //tab 被选中时触发这个函数
    async tabClicked(){
      /*console.log(this.activeIndex)*/
      //如果点击所激活的index等于1的话，就说明当前点击的是商品参数
      if(this.activeIndex === '1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'many'}
        })
        //如果状态码不是200 说明请求失败
        if(res.meta.status !== 200){
          return this.$message.error('获取商品动态参数失败')
        }

        //用循环去遍历数组  然后把数组里面的attr_vals 属性
        res.data.forEach(item => {
          //判断attr_vals里面的长度是否为空 如果为空就返回空的数组 不为空就用split() 方法用于把一个字符串以空格 分割成字符串数组。
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        //将请求的数据保存在manyTableData里面 好用于页面渲染
        this.manyTableData = res.data

      } else if(this.activeIndex === '2'){ //如果点击所激活的index等于2的话，就说明当前点击的是商品属性
        //发起请求
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}
        })
        //判断请求成功没有
        if(res.meta.status !== 200){
          return this.$message.error('获取商品静态属性失败')
        }

        this.onlyTableData = res.data


      }




    },

    //处理图片预览效果  参数表示当前图片的信息
    handlePreview(file){
      //将图片的url地址保存  用于更好的预览
      this.previewPath = file.response.data.url
      //图片预览对话框的显示与隐藏
      this.previewVisible = true
    },

    //处理移除图片的操作 点击叉号后会触发这个钩子  钩子里面有2个参数((file(表示将要被移除的那个图片信息), fileList(当前移除文件列表)))
    handleRemove(file){
      /*console.log(file)*/
      //1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      //2.从pics数组中，找到这个图片对应的索引值
        //findIndex()方法   查找数组的索引值
          //表示如果在x.pic===filePath 说明找到了对应的路径  ，会返回一个索引值   把得到的索引值保存在常量i
      const i=this.addForm.pics.findIndex(x => x.pic === filePath)
      //3.调用数组的splice方法，把图片信息对象，从pics数组中移除
        //表示将从i开始  删除1项  就是它本身
      this.addForm.pics.splice(i,1)
      console.log(this.addForm)
    },

    //只要图片上传成功  就会触发这个钩子 钩子里面有三个参数 ((response(表示服务器返回的数据), file(文件的信息), fileList(当前上传组件的文件列表)))
    handleSuccess(response){
      //1.拼接得到一个图片信息对象
      const picInfo = {
        pic:response.data.tmp_path
      }
      //2.将图片信息对象push到addForm.pics数组中
      this.addForm.pics.push(picInfo)
      /*console.log(this.addForm)*/

    },

    //添加商品按钮
    addGood(){

      this.$refs.addFormRef.validate(async valid => {
        //如果表单预验证不通过
        if(!valid){
          return this.$message.error('请填写必要的表单项!')
        }
        //表单预验证通过   就执行添加的业务逻辑

        /*将goods_cat从数组转化为字符串  直接转化有问题  因为级联选择框双向绑定的值必须是一个数组*/
        /*所以需要使用 lodash 的 cloneDeep(obj)方法 */
        const form = _.cloneDeep(this.addForm)//使用了lodash包
        form.goods_cat = this.addForm.goods_cat.join(',')

        //处理动态参数
        this.manyTableData.forEach(item => {
          /*创建一个空的对象*/
          const newInfo = {}
          //将遍历的值里面的attr_id属性与attr_vals属性添加到空的对象里面去
          newInfo.attr_id = item.attr_id
          newInfo.attr_value = item.attr_vals.join(' ')
          this.addForm.attrs.push(newInfo)
        })

        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id : item.attr_id,
            attr_value : item.attr_vals.join
          }
          this.addForm.attrs.push(newInfo)

        })

        //将addForm里面的attrs属性  添加到深拷贝的form的attrs属性里面去
        form.attrs = this.addForm.attrs

        /*console.log(form)*/

        //发起添加商品请求
        //商品的名称必须是唯一的
        const {data:res} = await this.$http.post('goods',form)
        console.log(res)
        if(res.meta.status !== 201){
          return this.$message.error('添加商品失败,请检查信息是否填写正确')
        }
        this.$message.success('添加商品成功')
        //添加成功后跳转到商品列表页面
        this.$router.push('/goods')

      })
    },


  },

  computed:{

    //三级分类的id
    cateId(){
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[this.addForm.goods_cat.length-1]
      }
      //如果长度没有3，说明不是三级分类 返回null
      return null
    },
  },

}
</script>

<style lang="less" scoped>
.el-card{
  box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;

}

.el-steps{
  margin:20px 0;
}

.steps{
  font-size: 13px;
}

.el-checkbox{
  margin:0  10px 0 0 !important;
}

.previewImg{
  width: 100%;
}

.btnAdd{
  margin-top: 15px;
}


</style>

<style>
/*样式穿透*/
.el-step__title{
  font-size: 13px;
}
</style>
