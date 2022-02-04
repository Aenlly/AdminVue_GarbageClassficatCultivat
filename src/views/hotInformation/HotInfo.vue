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
                  <el-option label="标题" value="0"></el-option>
                  <el-option label="描述" value="1"></el-option>
                  <el-option label="来源" value="2"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button @click="queryBy">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="state" style="width: 150px">
              <template #prefix> 状态：</template>
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in stateList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="2">
            <el-button type="primary" @click="goCreate"> 新增数据 </el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="deleteByIds">删除所选</el-button>
          </el-col>
        </el-row>
        <!-- 数据区域容器结束 -->
        <!-- 数据表格容器开始,selection-change当选择项发生变化时会触发该事件 -->
        <el-row>
          <el-col :span="24">
            <el-table
              :data="data.records"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              max-height="620"
              border
              stripe
            >
              <el-table-column type="selection" width="55" />
              <el-table-column fixed type="index" label="序号" width="60" />
              <el-table-column
                prop="hotInfoTitle"
                label="标题"
                show-overflow-tooltip
              />
              <el-table-column
                prop="hotInfoDesc"
                label="描述"
                show-overflow-tooltip
              />
              <el-table-column
                prop="sourceText"
                label="来源"
                show-overflow-tooltip
              />
              <el-table-column label="图片" width="150">
                <template #default="{ row }">
                  <el-tooltip content="单击预览" placement="bottom">
                    <el-image
                      :src="httpResource + row.imgUrl"
                      :preview-src-list="[httpResource + row.imgUrl]"
                      alt="单击预览"
                      fit="contain"
                    ></el-image>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="likeCount" label="点赞量" />
              <el-table-column prop="collectCount" label="收藏量" />
              <el-table-column prop="hotInfoState" label="状态" width="70" />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" fixed="right" width="175">
                <template #default="{ row }">
                  <el-row>
                    <el-col :span="8">
                      <el-tooltip content="发布内容" placement="bottom">
                        <el-button
                          type="success"
                          icon="el-icon-circle-plus-outline"
                          size="small"
                          @click="publish(row)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="8" :offset="8">
                      <el-tooltip content="下线内容" placement="bottom">
                        <el-button
                          type="warning"
                          icon="el-icon-remove-outline"
                          size="small"
                          @click="shelf(row)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-col :span="8">
                      <el-tooltip content="预览资讯" placement="bottom">
                        <el-button
                          icon="el-icon-view"
                          size="small"
                          @click="goCheck(row.hotInfoId)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="8">
                      <el-tooltip content="编辑数据" placement="bottom">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="small"
                          @click="goEdit(row.hotInfoId)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="8">
                      <el-tooltip content="删除数据" placement="bottom">
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="small"
                          @click="deleteById(row.hotInfoId)"
                        >
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
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
      breadcrumb: [{ name: "热门资讯管理" }, { name: "资讯信息管理" }],
      httpResource: this.$httpResource,
      getListUrl: "hot-info/getList", //获取数据的后台接口
      delByIdsUrl: "hot-info/delByIds", //批量删除的后台接口
      delByIdUrl: "hot-info/delById", //单一删除数据的后台接口
      editVideoList: [],
      editImageList: [],
      queryType: "0", //查询类型
      text: "", //查询内容
      state: "", //资讯状态
      stateList: ["待发布", "已发布", "已下线"], //资讯状态列表
      selectIds: [],
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
    //   监听资讯状态选项框，使其变动时，重新赋值，并进行查询
    state(val, oldVal) {
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
          queryType: this.queryType,
          text: this.text,
          state: this.state,
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
    // 选择时触发事件
    handleSelectionChange(val) {
      // 统计所选id
      this.selectIds = val.map((item) => item.hotInfoId);
    },

    // 删除所选触发批量删除事件
    deleteByIds() {
      //判断是否选择了数据
      if (this.selectIds.length > 0) {
        // 二次确认提示
        this.$messageBox
          .confirm("确认删除所选数据?", "警告", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(async () => {
            const { data: res } = await this.axios.delete(this.delByIdsUrl, {
              data: this.selectIds,
            });
            if ((res.code = 200)) {
              this.$message.success("删除成功!");
              this.queryBy();
            } else {
              this.$message.error("删除失败!");
            }
          })
          .catch(() => {});
      } else {
        this.$message.warning("请先选择数据!");
      }
    },

    // 发布按钮触发事件
    publish(row) {
      if (row.audit === "已发布") {
        this.$message.warning("该数据已是发布状态!");
      } else {
        this.updateRevise("/publish", row.hotInfoId, "发布成功");
      }
    },
    // 下线按钮触发事件
    shelf(row) {
      if (row.audit === "已下架") {
        this.$message.warning("该数据已是下线状态!");
      } else {
        this.updateRevise("/shelf", row.hotInfoId, "下线成功");
      }
    },

    // 更改状态方法
    async updateRevise(url, id, msg) {
      const { data: res } = await this.axios.put("/hot-info" + url + "/" + id);
      if ((res.code = 200)) {
        this.$message.success(msg);
        this.queryBy();
      } else {
        this.$message.error("设置失败!");
      }
    },

    // 删除按钮触发事件
    deleteById(id) {
      // 二次确认提示
      this.$messageBox
        .confirm("确认删除所选数据?", "警告", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          const { data: res } = await this.axios.delete(this.delByIdUrl, {
            params: {
              id: id,
            },
          });
          if (res.code == 200) {
            this.$message.success("删除成功!");
            this.queryBy();
          } else {
            this.$message.error("删除失败!");
          }
        })
        .catch(() => {});
    },
    goCheck(id) {
      this.$router.push({
        path: "/hotInfoCheck",
        query: {
          id: id,
        },
      });
    },
    goCreate() {
      this.$router.push("/hotInfoAdd");
    },
    // 跳转编辑页面
    goEdit(id) {
      this.$router.push({
        path: "/hotInfoEdit",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style>
</style>