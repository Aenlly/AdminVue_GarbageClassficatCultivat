<template>
  <Breadcrumb :infoTitles="breadcrumb" />

  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="3" style="flex: none">
            <el-select v-model="type" style="width: 180px">
              <template #prefix> 搜索类型：</template>
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in listType"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="2">
            <el-button type="primary" @click="getgetSearchChart">
              查看图表
            </el-button>
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
              <el-table-column fixed type="index" label="序号" width="60" />
              <el-table-column
                prop="name"
                label="搜索内容"
                show-overflow-tooltip
              />
              <el-table-column prop="type" label="搜索类型" />
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
  <el-dialog title="查看图表" v-model="dialogChartVisible">
    <el-row style="height: 500px">
      <el-col :span="24">
        <highcharts :options="chartOptions"></highcharts>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
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
          //   labels: {
          //     rotation: -45, // 设置轴标签旋转角度
          //   },
          // categories: ["文本搜索", "", "梨", "香蕉", "李子"], 指定x轴标题
        },
        // 图例显示的位置，默认为下方
        // legend: {
        //   layout: "vertical",
        //   align: "right",
        //   verticalAlign: "middle",
        // },
        // 绘图选项
        // plotOptions: {
        //   series: {
        //     // 标签
        //     label: {
        //       //是否允许将标签放置在远离图形的位置，并在图形上画一条连接线
        //       connectorAllowed: false,
        //     },
        //     //从多少开始
        //     // pointStart: 2010,
        //   },
        // },
        //数据 name(string)同时是侧边的图例, data[],如果是单组那么就series[name,data:[]]
        series: [],
        // 图表组件粒度响应式配置
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
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
      breadcrumb: [{ name: "搜索信息管理" }, { name: "用户搜索记录" }],
      dialogChartVisible: false,
      getListUrl: "/search-record/getList", //获取数据的后台接口
      getListTypeUrl: "/search-record/getListType", //获取搜索类型数据的后台接口
      getSearchChartUrl: "/search-record/getSearchChart", //获取图表数据的后台接口
      listType: [], //搜索类型集合
      type: "", //搜索的类型
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
    this.getListType();
  },
  // 监听变化的值
  watch: {
    //   监听订单状态选项框，使其变动时，重新赋值
    type(val, oldVal) {
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
          type: this.type,
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
    async getListType() {
      const { data: res } = await this.axios.get(this.getListTypeUrl);
      // 返回码进行判断
      if (res.code == 200) {
        this.listType = res.data; //赋值搜索类型
      } else {
        this.$message.error("请求数据失败");
      }
    },
    async getgetSearchChart() {
      this.dialogChartVisible = true;
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