<template>
  <el-container direction="vertical">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="12" :offset="6"> </el-col>
      </el-row>
    </el-header>
    <el-main><router-view /></el-main>
    <Footer />
  </el-container>
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  name: "Index",
  components: { Footer },
};
</script>

<style lang="less" scoped>
</style>