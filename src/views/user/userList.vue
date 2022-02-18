<template>
  <Breadcrumb :infoTitles="breadcrumb" />
  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6">
            <el-input v-model="text" placeholder="请输入搜索内容">
              <template #prepend> 用户昵称 </template>
              <template #append>
                <el-button @click="queryBy">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="2"> </el-col>
          <el-col :span="2"> </el-col>
        </el-row>
        <!-- 数据区域容器结束 -->
        <!-- 数据表格容器开始,selection-change当选择项发生变化时会触发该事件 -->
        <el-row>
          <el-col :span="24">
            <el-table
              :data="data.records"
              style="width: 100%"
              max-height="620"
              border
              stripe
            >
              <el-table-column prop="userId" label="用户编号" />
              <el-table-column
                prop="nickName"
                label="用户昵称"
                show-overflow-tooltip
              />
              <el-table-column prop="accumulativePoints" label="累积积分" />
              <el-table-column prop="answerPoints" label="答题积分" />
              <el-table-column prop="remainingPoints" label="剩余积分" />
              <el-table-column prop="pointsName" label="头衔名称" />
              <el-table-column label="操作" fixed="right" width="120">
                <template #default="{ row }">
                  <el-tooltip content="查看用户积分记录" placement="bottom">
                    <el-button
                      icon="el-icon-view"
                      size="small"
                      @click="pointsView(row.userId)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="查看用户订单记录" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-s-order"
                      size="small"
                      @click="orderView(row.userId)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 数据表格容器结束 -->
        <!-- 数据页码组件，需要调用显示页的方法 -->
        <Pagination
          :current="data.current"
          :size="data.size"
          :total="data.total"
          :getTableList="getTableList"
        />
      </el-card>
      <!-- 卡片结束 -->
    </el-col>
  </el-row>

  <!-- 订单记录弹窗开始 -->
  <el-dialog v-model="dialogOrderViewVisible" title="订单记录" top="10vh">
    <el-row>
      <el-col :span="24">
        <el-table :data="orderData.records" max-height="550" border stripe>
          <el-table-column label="订单编号" prop="orderId"></el-table-column>
          <el-table-column label="礼品名称" prop="giftName"></el-table-column>
          <el-table-column label="兑换码" prop="code"></el-table-column>
          <el-table-column label="核销状态" width="80">
            <template #default="{ row }">
              <el-tag>{{ row.state }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据页码组件，需要调用显示页的方法 -->
        <Pagination
          :current="orderData.current"
          :size="orderData.size"
          :total="orderData.total"
          :getTableList="getOrderTableList"
        />
      </el-col>
    </el-row>
  </el-dialog>
  <!-- 订单记录弹窗结束 -->

  <!-- 积分记录弹窗开始 -->
  <el-dialog v-model="dialogPointsVisible" title="积分记录" top="10vh">
    <el-row>
      <el-col :span="24">
        <el-table :data="pointsData.records" max-height="630" border stripe>
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column label="记录描述" prop="logDesc"></el-table-column>
          <el-table-column label="积分变动" prop="number"></el-table-column>
          <el-table-column label="变动状态" width="80">
            <template #default="{ row }">
              <el-tag>{{ row.type }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据页码组件，需要调用显示页的方法 -->
        <Pagination
          :current="pointsData.current"
          :size="pointsData.size"
          :total="pointsData.total"
          :getTableList="getPointsTableList"
        />
      </el-col>
    </el-row>
  </el-dialog>
  <!-- 积分记录弹窗结束 -->
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "用户信息列表" }],
      getListUrl: "/user/getList", //获取的数据的后台接口
      getOrderListByIdUrl: "/user/getOrderListById", //获取单个用户订单的数据的后台接口
      getPointsListByIdUrl: "/user/getPointsListById", //获取单个用户积分记录的数据的后台接口
      dialogOrderViewVisible: false, //查看订单记录的对话框
      dialogPointsVisible: false, //创建积分记录的对话框
      text: "", //查询内容
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
      orderData: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
      pointsData: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
      id: "",
    };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  created() {
    this.queryBy();
  },
  methods: {
    // 根据条件查询数据
    queryBy() {
      this.data.current = 1;
      this.getTableList(this.data.current, this.data.size);
    },
    // 查询数据
    async getTableList(current, size) {
      const { data: res } = await this.axios.get(this.getListUrl, {
        params: {
          current: current,
          size: size,
          text: this.text,
        },
      });
      console.log(res);
      if (res.code == 403) {
        // 清空本地信息
        window.sessionStorage.clear();
        this.$message("登录已过期");
        this.$router.push("/login");
      }
      // 返回码进行判断
      else if (res.code == 200) {
        this.$data.data = res.data;
        this.$message({
          message: "请求数据成功",
          duration: 1500,
          type: "success",
          "show-close": true,
        });
      } else {
        this.$message.error("请求数据失败");
      }
    },
    // 订单弹窗
    orderView(id) {
      this.id = id;
      this.dialogOrderViewVisible = true;
      this.getOrderTableList(this.orderData.current, this.orderData.size);
    },
    // 获取订单弹窗表格数据
    async getOrderTableList(current, size) {
      const { data: res } = await this.axios.get(this.getOrderListByIdUrl, {
        params: {
          current: current,
          size: size,
          id: this.id,
        },
      });
      if (res.code == 403) {
        // 清空本地信息
        window.sessionStorage.clear();
        this.$message("登录已过期");
        this.$router.push("/login");
      }
      // 返回码进行判断
      else if (res.code == 200) {
        this.$data.orderData = res.data;
        this.$message({
          message: "请求数据成功",
          duration: 1500,
          type: "success",
          "show-close": true,
        });
      } else {
        this.$message.error("请求数据失败");
      }
    },
    // 积分弹窗
    pointsView(id) {
      this.id = id;
      this.dialogPointsVisible = true;
      this.getPointsTableList(this.pointsData.current, this.pointsData.size);
    },
    // 获取积分弹窗表格数据
    async getPointsTableList(current, size) {
      const { data: res } = await this.axios.get(this.getPointsListByIdUrl, {
        params: {
          current: current,
          size: size,
          id: this.id,
        },
      });
      if (res.code == 403) {
        // 清空本地信息
        window.sessionStorage.clear();
        this.$message("登录已过期");
        this.$router.push("/login");
      }
      // 返回码进行判断
      else if (res.code == 200) {
        this.$data.pointsData = res.data;
        this.$message({
          message: "请求数据成功",
          duration: 1500,
          type: "success",
          "show-close": true,
        });
      } else {
        this.$message.error("请求数据失败");
      }
    },
  },
};
</script>

<style>
</style>