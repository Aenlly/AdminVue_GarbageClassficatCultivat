<template>
  <el-footer>
    <el-row>
      <el-col :span="24">
        <a href="http://beian.miit.gov.cn/">
          <span>湘ICP备2021019196号</span>
        </a>
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
a {
  height: 100%;
  line-height: 60px;
  color: #303133;
  text-decoration: none;
}
a:hover {
  color: #50a2de;
}
</style>