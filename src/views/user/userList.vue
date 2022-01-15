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
              <el-table-column label="垃圾类型" width="100">
                <template #default="scope">
                  <el-popover effect="light" trigger="hover" placement="top">
                    <template #default>
                      <p>中文名: {{ scope.row.nameCn }}</p>
                      <p>英文名: {{ scope.row.nameEn }}</p>
                    </template>
                    <template #reference>
                      <div class="name-wrapper">
                        <el-tag>{{ scope.row.garbageType }}</el-tag>
                      </div>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="textTitle"
                label="标题"
                show-overflow-tooltip
              />
              <el-table-column
                prop="textDesc"
                label="描述"
                show-overflow-tooltip
              />
              <el-table-column
                label="图标"
                class-name="tableImageUrl"
                width="55px"
              >
                <template #default="{ row }">
                  <el-image
                    :src="httpResource + row.imgUrl"
                    :style="'background-color:' + row.bgColor + ';height:35px'"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column label="视频" width="80">
                <template #default="{ row }">
                  <el-tooltip content="查看视频" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-view"
                      size="small"
                      @click="checkVideo(row.videoUrl)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="120">
                <template #default="{ row }">
                  <el-tooltip content="查看所属垃圾类型数据" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-s-unfold"
                      size="small"
                      @click="
                        this.$router.push({
                          path: '/indexGarbageList',
                          query: {
                            garbageTypeName: row.garbageType,
                            belongId: row.garbageId,
                          },
                        })
                      "
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑数据" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="small"
                      @click="editById(row)"
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
      breadcrumb: [{ name: "首页信息管理" }, { name: "垃圾类型管理" }],
      getListUrl: "/user/getList", //获取的数据的后台接口
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
    };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  created() {
    this.getTableList(this.data.current, this.data.size);
  },
  methods: {
    // 根据条件查询数据
    queryBy() {
      this.getTableList(this.data.current, this.data.size);
    },
    // 查询数据
    async getTableList(current, size) {
      const { data: res } = await this.axios.get(this.getListUrl, {
        params: {
          current: current,
          size: size,
          queryType: this.queryType,
          text: this.text,
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
    // pageSize每页数据量大小 改变时触发
    handleSizeChange(size) {
      this.size = size;
    },
    // current-change，单击页码时 改变时触发
    handleCurrentChange(current) {
      this.current = current;
      this.queryBy();
    },
  },
};
</script>

<style>
</style>