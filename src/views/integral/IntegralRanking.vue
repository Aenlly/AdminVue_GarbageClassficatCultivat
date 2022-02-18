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
          <el-col :span="4">
            <el-select
              v-model="pointsType"
              style="width: 165px"
              filterable
              remote
              :remote-method="remoteMethod"
            >
              <template #prefix>排序类型：</template>
              <el-option
                v-for="item in pointsTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
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
              <el-table-column label="操作" fixed="right" width="60">
                <template #default="{ row }">
                  <el-tooltip content="查看用户积分记录" placement="bottom">
                    <el-button
                      icon="el-icon-view"
                      size="small"
                      @click="pointsView(row.userId)"
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
      breadcrumb: [{ name: "积分信息管理" }, { name: "积分排名查看" }],
      getListUrl: "pointsRanking/getList", //获取的数据的后台接口
      getPointsListByIdUrl: "pointsRanking/getPointsListById", //获取单个用户积分记录的数据的后台接口
      dialogOrderViewVisible: false, //查看订单记录的对话框
      dialogPointsVisible: false, //创建积分记录的对话框
      text: "", //查询内容
      pointsType: 0, //排序条件
      pointsTypeList: [
        { label: "累积积分", value: 0 },
        { label: "答题积分", value: 1 },
        { label: "剩余积分", value: 2 },
      ], //排序条件集合
      data: {
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
  // 监听变化的值
  watch: {
    //   监听积分排序类型状态选项框，使其变动时，重新赋值
    pointsType(val, oldVal) {
      this.queryBy();
    },
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
          pointsType: this.pointsType,
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
    pointsView(id) {
      this.id = id;
      this.dialogPointsVisible = true;
      this.getPointsTableList(this.pointsData.current, this.pointsData.size);
    },
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