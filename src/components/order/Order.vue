<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!--搜索框-->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"  >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表数据区域-->
      <el-table :data="orderList" border stripe>

        <!--序列号-->
        <el-table-column label="#" type="index">
        </el-table-column>

        <!--订单编号-->
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>

        <!--订单价格-->
        <el-table-column label="订单价格" prop="order_price">
        </el-table-column>

        <!--是否付款-->
        <el-table-column label="是否付款" prpo="pay_status">
          <template #default="pay">
            <el-tag type="success"    v-if="pay.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger"    v-else>未付款</el-tag>
          </template>
        </el-table-column>

        <!--是否发货-->
        <el-table-column label="是否发货" prop="is_send">

        </el-table-column>

        <!--下单时间-->
        <el-table-column label="下单时间" prop="create_time">
          <template #default="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>

        <!--操作-->
        <el-table-column label="操作" >

          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>

        </el-table-column>

      </el-table>


      <!--分页区域-->
      <!--current-page  当前显示第几页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>


    <!--编辑按钮的对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
      >
      <!--表单区域-->
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px" >
        <!--省市区/县-->
        <el-form-item label="省市区/县 : " prop="addressCity">
          <!--级联选择框-->
          <el-cascader :options="cityData" v-model="addressForm.addressCity" :props="cascaderProps"></el-cascader>
        </el-form-item>

        <!--详细地址-->
        <el-form-item label="详细地址 : " prop="addressMore">
          <el-input v-model="addressForm.addressMore"></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--定位按钮的对话框-->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      >

      <!--时间线  reverse="true" 表示为倒序
          时间戳  timestamp
     -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
//导入城市数据
import cityData from './citydata'

//导入快递数据
import progressInfo from './progressInfo'

export default {
  name: 'Order',
  data(){
    return{
      //订单的数据对象
      queryInfo:{
        query:'',//查询参数
        pagenum:1,//当前页码
        pagesize:10,//每页显示条数
      },
      //保存请求过来的数据
      orderList:[],
      //总条数
      total:0,
      //编辑按钮的对话框
      editDialogVisible:false,
      //编辑按钮里面的表单数据对象
      addressForm:{
        addressCity:[],//省市区/县
        addressMore:'',//详细地址
      },
      //编辑按钮里面的表单校验规则
      addressRules:{
        //省市区/县校验规则
        addressCity:[
          {
            required:true,message:'请选择省市区/县',trigger:'blur'
          },
        ],
        //详细地址校验规则
        addressMore: [
          {
            required:true,message:'请填写详细地址',trigger:'blur'
          },
        ],
      },

      //导入cityData.js  保存里面的数据
      cityData:cityData,

      //级联选择框的props属性对象
      cascaderProps:{
        expandTrigger: 'hover',
        value:'value',
        label:'label',
        children:'children'
      },


      //定位按钮的对话框的显示
      progressVisible:false,

      // 因为接口问题 手动导入快递数据 然后保存快递数据
      progressInfo: progressInfo

    }
  },
  created () {
    this.getOrderList()
  },
  methods:{
    //请求订单数据列表
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{
        params:this.queryInfo
      })

      if(res.meta.status !==200){
        return this.$message.error('获取订单数据列表失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods

    },

    //只要分页发生了变化就触发这个钩子
    handleSizeChange(newSize){
      //每页几条数据显示
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    //只要页码值发生了变化 会触发这个钩子
    handleCurrentChange(newPage){
      //第几页
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    //展示修改地址的对话框
    showBox(){
      this.editDialogVisible = true
    },

    //监听编辑对话框的关闭
    editDialogClose(){
      //重置表单
      this.$refs.addressFormRef.resetFields()
    },

    //点击定位按钮
    async showProgressBox(){

      /* 后台接口有问题
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
        if(res.meta.status !== 200){
          return this.$message.error('获取物流进度失败')
        }
        console.log(res)
        */







      this.progressVisible = true
    },




  },
}
</script>

<style lang="less" scoped>
.el-card{
  box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;

}
.el-cascader{
  width: 100%;
}

</style>
