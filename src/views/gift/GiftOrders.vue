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
              <template #prepend>
                <el-select
                  v-model="queryType"
                  placeholder="请选择"
                  style="width: 110px"
                >
                  <el-option label="订单编号" value="0"></el-option>
                  <el-option label="礼品名称" value="1"></el-option>
                  <el-option label="兑换码" value="2"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button @click="queryBy">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="3">
            <el-select v-model="state" style="width: 150px">
              <template #prefix> 订单状态：</template>
              <el-option label="全部" value=""></el-option>
              <el-option label="未核销" value="-1"></el-option>
              <el-option label="已核销" value="1"></el-option>
            </el-select>
          </el-col>
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
              <el-table-column prop="orderId" label="订单编号" />
              <el-table-column prop="giftId" label="礼品编号" />
              <el-table-column prop="giftName" label="礼品名称" />
              <el-table-column prop="code" label="兑换码" />
              <el-table-column prop="state" label="订单状态" />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" fixed="right" width="80">
                <template #default="{ row }">
                  <el-tooltip content="核销订单" placement="bottom">
                    <el-button
                      type="warning"
                      icon="el-icon-edit-outline"
                      size="small"
                      @click="orderWriteOff(row)"
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
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "礼品信息管理" }, { name: "订单信息管理" }],
      getListUrl: "/orders/getList", //获取的数据的后台接口
      orderWriteOffUrl: "/orders/writeOff/", //核销订单的后台接口
      queryType: "0", //查询类型
      text: "", //查询内容
      state: "", //订单状态
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
    };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  created() {
    this.queryBy();
  },
  // 监听变化的值
  watch: {
    //   监听订单状态选项框，使其变动时，重新赋值
    state(val, oldVal) {
      this.queryBy();
    },
  },
  methods: {
    // 根据条件查询数据
    queryBy() {
      this.getTableList(1, this.data.size);
    },
    // 查询数据
    async getTableList(current, size) {
      const { data: res } = await this.axios.get(this.getListUrl, {
        params: {
          current: current,
          size: size,
          queryType: this.queryType,
          text: this.text,
          state: this.state,
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
    // 核销订单
    orderWriteOff(row) {
      if (row.state === "已核销") {
        this.$message.warning("已是核销状态，无法操作");
        retrun;
      }
      this.$messageBox
        .confirm("确定核销该订单?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          const { data: res } = await this.axios.put(
            this.orderWriteOffUrl + row.orderId
          );
          if (res.code == 403) {
            // 清空本地信息
            window.sessionStorage.clear();
            this.$message("登录已过期");
            this.$router.push("/login");
          }
          // 返回码进行判断
          else if (res.code == 200) {
            if (res.data === true) {
              this.$message.success("核销成功");
              this.queryBy();
              return;
            }
          }
          this.$message.error("核销失败");
        })
        .catch(() => {});
    },
  },
};
</script>

<style>
</style>