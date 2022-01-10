<template>
  <el-row>
    <el-col :span="24">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: 'index' }"> 首页 </el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item.name">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    infoTitles: Array,
  },
  data() {
    return {
      breadcrumb: this.$props.infoTitles,
    };
  },
};
</script>

<style lang="less" scoped>
</style>