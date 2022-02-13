<template>
  <Breadcrumb :infoTitles="breadcrumb" />
  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6"> </el-col>
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
                prop="questionnaireName"
                label="问卷名称"
                show-overflow-tooltip
              />
              <el-table-column prop="groupForm" label="组卷类型" />
              <el-table-column prop="singleSelection" label="单选题数量" />
              <el-table-column prop="weekNumber" label="可答次数" />
              <el-table-column label="操作" fixed="right" width="60">
                <template #default="{ row }">
                  <el-tooltip content="查看答卷列表" placement="bottom">
                    <el-button
                      icon="el-icon-view"
                      size="small"
                      @click="goCheck(row.id)"
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
import Breadcrumb from "@/components/Breadcrumb.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "知识测验管理" }, { name: "问卷信息管理" }],
      getListUrl: "questionnaire/getList", //获取问卷信息的后台接口
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
    };
  },
  watch: {},
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
    // 跳转至答卷列表页面中
    goCheck(id) {
      this.$router.push({
        path: "/questionSheet",
        query: {
          belongId: id,
        },
      });
    },
  },
};
</script>

<style>
</style>