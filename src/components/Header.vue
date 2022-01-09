<template>
  <el-header>
    <div class="header-image" @click="indexClick">
      <el-image
        :src="require('../assets/logo.png')"
        fit="fill"
        style="height: 100%"
      ></el-image>
      <span>垃圾分类养成后台管理系统</span>
    </div>
    <div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :src="imgUrl" @click="avatarMenu" />
        </span>
        <template #dropdown>
          <div class="menu-box">
            <el-dropdown-menu>
              <div class="name-box">
                <span>{{ name }}</span>
              </div>
              <el-divider></el-divider>
              <el-dropdown-item>账号信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      name: window.sessionStorage.getItem("name"),
      imgUrl: window.sessionStorage.getItem("imgUrl"),
    };
  },
  methods: {
    //跳转首页
    indexClick() {
      this.$router.push("/index");
    },
    // 退出登录
    logout() {
      this.$messageBox
        .confirm("确认退出登录？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning", //警告
        })
        .then(() => {
          // 清空本地信息
          window.sessionStorage.clear();
          this.$message("退出登录成功");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    avatarMenu() {},
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.header-image {
  display: flex;
  align-items: center;
  height: 100%;
  > span {
    font-size: 20px;
    margin-left: 15px;
  }
}
.menu-box {
  padding: 0 20px;
}
.name-box {
  line-height: 36px;
  color: var(--el-text-color-regular);
  outline: 0;
  text-align: center;
}
</style>