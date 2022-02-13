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
              <el-table-column prop="name" label="题库名称" />

              <el-table-column
                prop="description"
                label="题库描述"
                show-overflow-tooltip
              />
              <el-table-column prop="subjectCount" label="题目总数" />
              <el-table-column label="操作" fixed="right" width="120">
                <template #default="{ row }">
                  <el-tooltip content="查看题库题目" placement="bottom">
                    <el-button
                      icon="el-icon-view"
                      size="small"
                      @click="goCheck(row.id)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="修改描述" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="small"
                      @click="onEdit(row)"
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
import qs from "qs";

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "知识测验管理" }, { name: "题库信息管理" }],
      getListUrl: "question-bank/getList", //获取题库信息的后台接口
      updateUrl: "question-bank/update", //修改数据的后台接口
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
    onEdit(row) {
      this.$messageBox
        .prompt("请输入修改后的描述", "修改窗口", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /[\s\S]{1,200}/,
          inputValue: row.description,
          inputErrorMessage: "请输入题库描述,长度必须大于2小于200个字符",
        })
        .then(async ({ value }) => {
          const info = { id: row.id, description: value };
          const { data: res } = await this.axios.put(
            this.updateUrl,
            qs.stringify(info)
          );
          if (res.code == 200) {
            this.$message.success("修改数据成功!");
            if (res.data === true) {
              this.queryBy();
              return;
            }
          }
          this.$message.error("修改数据失败!");
        })
        .catch(() => {});
    },
    goCheck(id) {
      this.$router.push({
        path: "/subjectList",
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