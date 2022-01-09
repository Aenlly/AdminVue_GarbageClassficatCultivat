<template>
  <el-container direction="vertical">
    <Header />
    <el-container>
      <Aside />
      <el-container direction="vertical">
        <el-main><router-view /></el-main>
        <Footer />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Index",
  components: { Header, Aside, Footer },
};
</script>

<style lang="less" scoped>
</style>