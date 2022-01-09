<template>
  <el-container direction="vertical">
    <Head />
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
import Head from "@/components/Head.vue";
import Aside from "@/components/Aside.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Index",
  components: { Head, Aside, Footer },
};
</script>

<style>
</style>