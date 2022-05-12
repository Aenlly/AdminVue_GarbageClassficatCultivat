<template>
  <el-container direction="vertical">
    <el-header>
      <el-row>
        <el-col :span="16" :offset="4">
          <el-row>
            <el-col :span="4" class="header-view">
              <span class="index_header"> {{ title }} </span>
            </el-col>
            <el-col :span="20">
              <!-- unique-opened每次只打开一个菜单，default-active默认选择,collapse-transition关闭折叠动画,router开启路由 -->
              <el-menu
                :default-active="activeIndex"
                mode="horizontal"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
              >
                <template v-for="item in menuList" :key="item.authName">
                  <el-submenu
                    v-if="item.children.length > 0"
                    :index="item.authName"
                  >
                    <template #title>{{ item.authName }}</template>
                    <template v-for="i in item.children" :key="i.authName">
                      <el-submenu
                        v-if="i.children.length > 0"
                        :index="i.authName"
                      >
                        <template #title>{{ i.authName }}</template>
                        <template v-for="j in i.children" :key="j.authName">
                          <el-submenu
                            v-if="j.children.length > 0"
                            :index="j.authName"
                          >
                            <template #title>{{ j.authName }}</template>
                          </el-submenu>
                          <el-menu-item
                            v-else
                            :index="j.authName"
                            @click="goJump(j.path)"
                          >
                            {{ j.authName }}
                          </el-menu-item>
                        </template>
                      </el-submenu>
                      <el-menu-item
                        v-else
                        :index="i.authName"
                        @click="goJump(i.path)"
                      >
                        {{ i.authName }}
                      </el-menu-item>
                    </template>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :index="item.authName"
                    @click="goJump(item.path)"
                  >
                    {{ item.authName }}
                  </el-menu-item>
                </template>
              </el-menu>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row style="height: 100%">
        <el-col :span="16" :offset="4">
          <el-row class="main-row">
            <el-col :span="24"> 欢迎（未编写主页） </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
    <el-row>
      <el-col :span="16" :offset="4">
        <Footer />
      </el-col>
    </el-row>
  </el-container>
</template>

<script >
import Footer from "@/components/Footer.vue";
export default {
  components: { Footer },
  data() {
    return {
      title: "Aenlly接入站",
      activeIndex: "/",
      menuList: [
        {
          authName: "首页",
          path: "/",
          children: [],
        },
        {
          authName: "文章",
          path: "/",
          children: [],
        },
        {
          authName: "作品",
          children: [
            {
              authName: "图书管理系统(C#)",
              children: [
                {
                  authName: "项目",
                  path: "/",
                  children: [],
                },
                {
                  authName: "源码",
                  path: "https://github.com/Aenlly/Library",
                  children: [],
                },
              ],
            },
            {
              authName: "垃圾分类养成小程序",
              children: [
                {
                  authName: "进入项目",
                  path: "https://www.aenlly.top/#/login",
                  // path: "http://192.168.93.128/#/login",
                  // path: "http:127.0.0.1/#/login",
                  children: [],
                },
                {
                  authName: "后台前端源码",
                  path: "https://github.com/Aenlly/AdminVue_GarbageClassficatCultivat",
                  children: [],
                },
                {
                  authName: "服务器源码源码",
                  path: "https://github.com/Aenlly/Server_GarbageClassficatCultivat",
                  children: [],
                },

                {
                  authName: "小程序源码源码",
                  path: "https://github.com/Aenlly/WeChat_GarbageClassficatCultivat",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          authName: "联系作者",
          path: "/",
          children: [],
        },
      ],
    };
  },
  methods: {
    goJump(path) {
      window.location.href = path;
    },
  },
};
</script>

<style lang="less" scoped>
.header-view {
  background-color: #545c64;
  border-bottom: solid 2px #ffffff;
}
.index_header {
  font-family: 华文隶书;
  color: #ffffff;
  font-size: 25px;
  line-height: 60px;
  border: none;
}
.el-main {
  --el-main-padding: 0 20px;
}
.main-row {
  height: 100%;
  background-color: #ecf5ff;
  border: 1px solid #ecf5ff;
}
.el-footer {
  padding: 0;
  margin: 0 13px;
}
</style>
