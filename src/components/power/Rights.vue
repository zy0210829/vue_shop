<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>

      <!--权限列表区域      :data  表示绑定一个数据源     stripe  隔行变色-->
      <el-table :data="rightsList" border stripe>

        <el-table-column type="index" label="#">
        </el-table-column>

        <el-table-column label="权限名称" prop="authName">
        </el-table-column>

        <el-table-column label="路径" prop="path">
        </el-table-column>

        <el-table-column label="权限点击" prop="level">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'"  type="success">二级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'"  type="warning">三级</el-tag>
          </template>
        </el-table-column>

      </el-table>

    </el-card>

  </div>
</template>

<script>
export default {
  name: 'Rights',
  data(){
    return{
      //权限列表
      rightsList:[]
    }
  },

  created(){
    //获取所有的权限
    this.getRightsList()
  },

  methods:{
    //获取权限列表
    async getRightsList(){
      const {data:res} = await this.$http.get('rights/list')
      //判断请求是否成功
      if(res.meta.status !== 200){
        return this.$message.error('获取权限列表失败')
      }
      //将请求成功的数据保存在rightsList里面
      this.rightsList = res.data

    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;

}
</style>
