<template>
  <el-row class="data-footer">
    <el-col :span="24">
      <el-pagination
        :page-sizes="[10, 20, 30, 50]"
        v-model:page-size="sizes"
        v-model:current-page="currents"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
import { toRefs } from "vue";
export default {
  props: {
    //当前页，每页数据量，总数量
    current: Number,
    size: Number,
    total: Number,
    getTableList: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    const { current: currents, size: sizes } = toRefs(props);
    return { currents, sizes };
  },
  methods: {
    // pageSize每页数据量大小 改变时触发
    handleSizeChange(val) {
      this.sizes = val;
      this.getTableList(1, val);
    },
    // current-change，单击页码时 改变时触发
    handleCurrentChange(val) {
      this.getTableList(val, this.sizes);
    },
  },
};
</script>

<style lang="less" scoped>
.data-footer {
  padding-top: 24px;
}
</style>