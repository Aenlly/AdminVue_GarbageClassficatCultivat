<template>
  <Breadcrumb :infoTitles="breadcrumb" />
  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <!-- 标题容器开始 -->
        <el-row justify="space-between">
          <el-col :span="24" style="text-align: left">
            <span class="title_span">数据统计信息 </span>
            <el-select v-model="timeType" style="width: 180px">
              <el-option
                v-for="item in timeTypeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 标题容器结束 -->
        <el-divider></el-divider>

        <el-row :gutter="20">
          <el-col v-for="item in CountList" :key="item.color" :span="2">
            <Tag
              :color="item.color"
              :title="item.title"
              :number="item.number"
            />
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row style="height: 50px">
          <el-col :span="24"> </el-col>
        </el-row>
        <!-- 图表容器开始,selection-change当选择项发生变化时会触发该事件 -->
        <el-row>
          <el-col :span="18">
            <highcharts :options="chartOptions"></highcharts>
          </el-col>
          <el-col :span="6">
            <highcharts :options="pieOptions"></highcharts>
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
import Tag from "@/views/statistics/components/Tag.vue";

// 柱状图配置
var chartOptions = {
  chart: {
    type: "column",
  },
  title: {
    text: "关键字搜索前十统计情况",
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
  series: [
    {
      name: "搜索次数",
      data: [],
    },
  ],
  // 图表组件粒度响应式配置
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 550,
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
};
// 饼图配置
var pieOptions = {
  chart: {
    type: "pie",
  },
  title: {
    text: "搜索类型使用占比",
  }, //标题
  series: [
    {
      name: "使用次数",
      data: [],
    },
  ],
  // 图表组件粒度响应式配置
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 550,
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
};

export default {
  components: { Breadcrumb, Tag },
  data() {
    return {
      breadcrumb: [{ name: "数据信息统计" }],
      chartOptions: chartOptions,
      pieOptions: pieOptions,
      getInitUrl: "statistics/getInit", //获取统计数据的后台接口
      CountList: [],
      timeType: 3,
      timeTypeList: [
        {
          label: "今天",
          value: 0,
        },
        {
          label: "近七天",
          value: 1,
        },
        {
          label: "近三十天",
          value: 2,
        },
        {
          label: "上个月",
          value: 3,
        },
      ],
    };
  },
  created() {
    this.getStatistics();
  },
  // 监听变化的值
  watch: {
    //   监听订单状态选项框，使其变动时，重新赋值
    timeType(val, oldVal) {
      this.getStatistics();
    },
  },
  methods: {
    // 获取搜索内容图表信息
    async getStatistics() {
      const { data: res } = await this.axios.get(this.getInitUrl, {
        params: {
          timeType: this.timeType,
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
        // 设置柱状图数据
        this.chartOptions.series[0].data = res.data.columnChart;
        // 获取饼图数据长度
        const len = res.data.pieChart.length;
        // 修改结构
        for (var i = 0; i < len; i++) {
          res.data.pieChart[i].name = res.data.pieChart[i].type;
        }
        console.log(res.data);
        // 设置饼图数据
        this.pieOptions.series[0].data = res.data.pieChart;
        this.CountList = [
          { color: "#1c3d8a", title: "新增用户", number: res.data.userCount },
          { color: "#50a2de", title: "签到次数", number: res.data.signCount },
          { color: "#37b958", title: "收藏量", number: res.data.collectCount },
          { color: "#eea525", title: "点赞量", number: res.data.likeCount },
        ];
      } else {
        this.$message.error("请求数据失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 头部标题样式
.title_span {
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
}
</style>