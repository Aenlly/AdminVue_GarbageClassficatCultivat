<template>
  <!-- 配置语言，参考https://element-plus.gitee.io/zh-CN/component/config-provider.html -->
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script>
// 导入语言包
import lang from "element-plus/lib/locale/lang/zh-cn";
export default {
  name: "App",
  data() {
    return {
      locale: lang,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
