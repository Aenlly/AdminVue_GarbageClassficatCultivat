<template>
  <el-footer>
    <el-row>
      <el-col :span="24">
        <el-link type="info" href="http://beian.miit.gov.cn/" target="_blank">
          湘ICP备2021019196号
        </el-link>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>
<style lang="less" scoped>
.el-footer {
  background-color: #dcdfe6;
}
.el-row,
.el-col {
  height: 100%;
}
.el-link {
  height: 100%;
  line-height: 100%;
}
</style>