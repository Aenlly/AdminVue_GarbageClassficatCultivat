<template>
  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-page-header content="答卷信息列表" @back="goBack" />
          </div>
        </template>
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6" style="text-align: left">
            <el-date-picker
              v-model="timeArray"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="changeTime"
            ></el-date-picker>
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
              <el-table-column fixed type="index" label="序号" width="60" />
              <el-table-column
                prop="belongQuestionnaireName"
                label="所属问卷"
              />
              <el-table-column
                prop="randomBatchIndex"
                label="随机批次组卷号"
                show-overflow-tooltip
              />
              <el-table-column prop="totalScore" label="总得分" />
              <el-table-column prop="rightAmount" label="答对数量" />
              <el-table-column prop="errorAmount" label="错题数量" />
              <el-table-column prop="unAnsweredAmount" label="未答数量" />
              <el-table-column prop="state" label="答卷状态" width="80" />
              <el-table-column prop="submitTime" label="提交时间" width="160" />
              <el-table-column label="操作" fixed="right" width="60">
                <template #default="{ row }">
                  <el-tooltip content="查看答题结果" placement="bottom">
                    <el-button
                      icon="el-icon-view"
                      size="small"
                      @click="onCheck(row.id)"
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

  <!-- 查看所属答卷答案弹窗开始 -->
  <el-dialog title="答卷-答案列表" v-model="dialogCheckVisible">
    <el-row>
      <el-col :span="24">
        <el-table :data="answerData" border stripe>
          <el-table-column fixed type="index" label="序号" width="60" />
          <el-table-column
            prop="belongTopicName"
            label="题目内容"
            show-overflow-tooltip
          />
          <el-table-column
            prop="selectedOptionName"
            label="选项内容"
            show-overflow-tooltip
          />
          <el-table-column prop="answerResults" label="正确选项" />
          <el-table-column prop="score" label="得分" />
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- 查看所属答卷答案弹窗结束 -->
</template>

<script>
import Pagination from "@/components/Pagination.vue";

export default {
  components: { Pagination },
  data() {
    return {
      breadcrumb: [{ name: "知识测验管理" }, { name: "答卷信息管理" }],
      belongId: this.$route.query.belongId, //上一页面传值所属问卷id
      getListUrl: "questionSheet/getList", //获取答卷信息的后台接口
      getListByBelongPaperIdUrl: "questionSheet/getListByBelongPaperId", //获取答卷-答案信息的后台接口
      timeArray: [],
      answerData: [],
      dialogCheckVisible: false,
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
    };
  },
  watch: {
    timeArray(val, oldVal) {
      if (val == null) {
        console.log(val);
        this.queryBy();
      }
    },
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  created() {
    this.queryBy();
  },
  methods: {
    //   返回上一页
    goBack() {
      this.$router.go(-1);
    },
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
          belongId: this.belongId,
          startTime: this.timeArray == null ? "" : this.timeArray[0],
          endTime: this.timeArray == null ? "" : this.timeArray[1],
        },
      });
      // 返回码进行判断
      if (res.code == 200) {
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
    // 时间区间选择后
    changeTime() {
      console.log(this.timeArray);
      this.queryBy();
    },
    async onCheck(id) {
      const { data: res } = await this.axios.get(
        this.getListByBelongPaperIdUrl + "/" + id
      );
      // 返回码进行判断
      if (res.code == 200) {
        this.$data.answerData = res.data;
        this.dialogCheckVisible = true;
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