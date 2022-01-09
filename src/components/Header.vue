<template>
  <el-header>
    <div class="header-image">
      <el-image
        :src="require('../assets/logo.png')"
        :fit="fill"
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
              <hr />
              <el-dropdown-item>账号信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
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
      name: "管理员",
      imgUrl: "https://placeimg.com/640/480/any",
    };
  },
  methods: {
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