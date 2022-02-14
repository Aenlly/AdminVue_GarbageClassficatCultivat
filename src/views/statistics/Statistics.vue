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
        <!-- 图表区域容器结束 -->
        <!-- 图表容器开始,selection-change当选择项发生变化时会触发该事件 -->
        <el-row>
          <el-col :span="24">
            <highcharts :options="chartOptions"></highcharts>
          </el-col>
        </el-row>
        <!-- 图表容器结束 -->
      </el-card>
      <!-- 卡片结束 -->
    </el-col>
  </el-row>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";

export default {
  components: { Breadcrumb },
  data() {
    return {
      breadcrumb: [{ name: "数据信息统计" }],
      chartOptions: {
        chart: {
          type: "column",
        },
        title: {
          text: "关键字搜索排名前十30天统计情况",
        }, //标题
        subtitle: {}, //显示数据来源
        yAxis: {
          title: {
            text: "关键字搜索次数", //y轴标题
          },
        },
        // x轴标题
        xAxis: {
          type: "category",
        },
        //数据 name(string)同时是侧边的图例, data[],如果是单组那么就series[name,data:[]]
        series: [],
        // 图表组件粒度响应式配置
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: "100%",
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      },
      getSearchChartUrl: "/search-record/getSearchChart", //获取图表数据的后台接口
    };
  },
  created() {
    this.getgetSearchChart();
  },
  methods: {
    // 获取图表信息
    async getgetSearchChart() {
      const { data: res } = await this.axios.get(this.getSearchChartUrl);
      // 返回码进行判断
      if (res.code == 200) {
        const j = res.data.length;
        console.log(i);
        var list = [];
        // categories.
        for (var i = 0; i < j; i++) {
          var data = [res.data[i].name, res.data[i].data];
          list[i] = data;
        }
        this.chartOptions.series[0] = {
          name: "搜索次数",
          data: list,
        };
        console.log(res);
      } else {
        this.$message.error("请求数据失败");
      }
    },
  },
};
</script>

<style>
</style>