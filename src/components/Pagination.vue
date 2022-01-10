<template>
  <el-row class="data-footer">
    <el-col :span="24">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";

// 总数据量
const total = 10;
// 当前页
const currentPage = ref(4);
// pageSize每页数据量大小 改变时触发
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};
// current-change，单击页码时 改变时触发
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};
</script>

<style lang="less" scoped>
.data-footer {
  padding-top: 24px;
}
</style>