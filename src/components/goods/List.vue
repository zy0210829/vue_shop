<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!--卡片视图区域-->
    <el-card>
      <el-row :gutter="30">
        <!--输入框-->
        <el-col :span="8">
          <!--将搜索框的值绑定到query上面-->
          <!--clearable  清空搜索框   当点击清空搜索框的时候会触发clear事件   然后重新获取所有的数据-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <!--点击搜索的时候调用函数 根据搜索框的值去调用getGoodsList函数  获取对应的商品列表-->
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!--按钮-->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>


      <!--table表格区域-->
      <el-table :data="goodsList" border stripe>
        <!--索引列-->
        <el-table-column type="index" label="#">
        </el-table-column>
        <!--商品名称列-->
        <el-table-column label="商品名称" prop="goods_name">
        </el-table-column>
        <!--商品价格列-->
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px">
        </el-table-column>
        <!--商品重量列-->
        <el-table-column label="商品重量" prop="goods_weight" width="70px">
        </el-table-column>
        <!--创建时间列-->
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template #default="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <!--操作列-->
        <el-table-column label="操作" width="130px">
          <template #default="opt">
            <!--编辑按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(opt.row.goods_id)"></el-button>

          </template>

        </el-table-column>
      </el-table>


      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>




    </el-card>


  </div>
</template>

<script>
export default {
  name: 'List',
  data(){
    return{
      //查询参数对象
      queryInfo:{
        query:'',//搜索关键字
        pagenum:1,//默认获取第一页
        pagesize:10,//默认获取10条
      },
      //商品列表
      goodsList:[],
      //总数据条数
      total:0,

    }
  },
  created () {
    this.getGoodsList()
  },
  methods:{
    //根据分页获取对应的商品列表
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{
        params:this.queryInfo
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取商品列表失败')
      }
      /*this.$message.success('获取商品列表成功')
      console.log(res)*/
      this.goodsList = res.data.goods
      this.total = res.data.total

    },

    //当每页显示条目个数发生变化，会触发这个函数，得到最新的条目个数
    handleSizeChange(newSize){
      //将得到的最新条数保存在queryInfo
      this.queryInfo.pagesize = newSize
      //重新渲染数据
      this.getGoodsList()
    },

    //当前的页码值发生变化后触发这个函数，得到最新的页码值
    handleCurrentChange(newPage){
      //将得到的最新页码数保存在queryInfo
      this.queryInfo.pagenum = newPage
      //重新渲染数据
      this.getGoodsList()
    },

    //删除按钮
    async removeById(id){
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)//catch  捕获错误

      if(result !== 'confirm'){
        return this.$message.info('已取消删除')
      }

      const {data:res} = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !== 200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      //删除后重新渲染页面
      this.getGoodsList()

    },

    //添加商品按钮
    goAddPage(){
      this.$router.push('/goods/add')
    }

  },
}
</script>

<style lang="less" scoped>
.el-card{
  box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;

}
</style>
