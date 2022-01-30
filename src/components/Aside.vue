<template>
  <el-aside :width="isCollapse ? '65px' : '200px'">
    <el-row>
      <el-col :span="24" class="toggle-col" @click="toggle">
        <span>|||</span>
      </el-col>
    </el-row>
    <el-row class="menu-container">
      <el-col :span="24">
        <!-- unique-opened每次只打开一个菜单，default-active默认选择,collapse-transition关闭折叠动画,router开启路由 -->
        <el-menu
          active-text-color="#409eff"
          background-color="#545c64"
          :default-active="activeState"
          text-color="#fff"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          router
        >
          <template v-for="item in menuList" :key="item.authName">
            <el-submenu v-if="item.children.length > 0" :index="item.authName">
              <template #title>
                <i :class="item.ico"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="childen.path"
                  v-for="childen in item.children"
                  :key="childen.authName"
                  @click="saveActiveState"
                  >{{ childen.authName }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.path" @click="saveActiveState">
              <i :class="item.ico"></i>
              <span>{{ item.authName }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      isCollapse: false,
      activeState: "0",
      menuList: [
        {
          authName: "数据信息统计",
          ico: "el-icon-s-data",
          path: "statistics",
          children: [],
        },
        {
          authName: "用户信息列表",
          ico: "el-icon-user",
          path: "userList",
          children: [],
        },
        {
          authName: "首页信息管理",
          ico: "el-icon-house",
          children: [
            {
              authName: "视频信息管理",
              path: "indexVideo",
            },
            {
              authName: "轮播信息管理",
              path: "indexCarousel",
            },
            {
              authName: "垃圾类型管理",
              path: "IndexGarbageType",
            },
          ],
        },
        {
          authName: "礼品信息管理",
          ico: "el-icon-present",
          children: [
            {
              authName: "礼品信息管理",
              path: "giftManage",
            },
            {
              authName: "订单信息管理",
              path: "giftOrders",
            },
          ],
        },
        {
          authName: "知识测验管理",
          ico: "el-icon-tickets",
          children: [
            {
              authName: "题库管理",
              path: "questionBank",
            },
            {
              authName: "问卷管理",
              path: "questionnaire",
            },
            {
              authName: "答卷管理",
              path: "answer",
            },
            {
              authName: "测验排名",
              path: "user",
            },
          ],
        },
        {
          authName: "变废为宝管理",
          ico: "el-icon-receiving",
          children: [
            {
              authName: "信息管理",
              path: "wasteTurnTreasure",
            },
            {
              authName: "审核管理",
              path: "wasteTurnTreasureAudit",
            },
          ],
        },
        {
          authName: "资讯信息管理",
          ico: "el-icon-reading",
          children: [
            {
              authName: "信息管理",
              path: "information",
            },
          ],
        },
        {
          authName: "积分信息管理",
          ico: "el-icon-coin",
          children: [
            {
              authName: "积分记录查看",
              path: "integralRecord",
            },
            {
              authName: "积分头衔管理",
              path: "integralTitle",
            },
          ],
        },
        {
          authName: "搜索信息管理",
          ico: "el-icon-search",
          children: [
            {
              authName: "搜索信息库",
              path: "searchLibrary",
            },
            {
              authName: "用户搜索记录",
              path: "searchRecord",
            },
          ],
        },
      ],
    };
  },
  created() {
    this.$data.activeState = window.sessionStorage.getItem("activeState");
    // this.getMenuList();
  },
  methods: {
    // 缩放菜单栏事件
    toggle() {
      this.$data.isCollapse = !this.$data.isCollapse;
    },
    saveActiveState(activeState) {
      console.log(activeState);
      window.sessionStorage.setItem("activeState", activeState.index);
      this.$data.activeState = activeState;
    },
  },
};
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #545c64;
  height: 100%;
}
.toggle-col {
  background-color: #707070;
  font-size: 15px;
  line-height: 30px;
  color: #fff;
  letter-spacing: 0.2em; //间距
  cursor: pointer; //鼠标移动到上面的样式
}
.el-menu {
  text-align: left;
  border-right: none;
}
// .el-submenu .el-menu-item {
//   padding-left: 50px;
// }
</style>