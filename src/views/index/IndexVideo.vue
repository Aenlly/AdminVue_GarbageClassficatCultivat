<template>
  <Breadcrumb :infoTitles="breadcrumb" />
  <el-row>
    <el-col :span="24">
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
                  <el-option label="视频标题" value="0"></el-option>
                  <el-option label="视频简介" value="1"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button @click="quearyBy">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="2">
            <el-button type="primary" @click="dialogCreateVisible = true">
              上传视频
            </el-button>
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
                prop="videoTitle"
                label="标题"
                show-overflow-tooltip
              />
              <el-table-column
                prop="videoDesc"
                label="描述"
                show-overflow-tooltip
              />
              <el-table-column prop="videoCheck" label="状态" />
              <el-table-column prop="shareCount" label="分享数" />
              <el-table-column label="操作" fixed="right">
                <template #default="{ row }">
                  <el-tooltip content="置顶内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-top"
                      size="small"
                      @click="top(row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="发布内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      size="small"
                      @click="publish(row)"
                    ></el-button>
                  </el-tooltip>

                  <el-tooltip content="下架内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-remove-outline"
                      size="small"
                      @click="shelf(row)"
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

                  <el-tooltip content="删除数据" placement="bottom">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="deleteById(row.videoId)"
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
          :getList="getList"
        />
      </el-card>
    </el-col>
  </el-row>
  <!-- 创建数据弹窗开始 -->
  <el-dialog v-model="dialogCreateVisible" title="创建数据">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form :model="create">
          <el-form-item label="标题">
            <el-input
              v-model="create.videoTitle"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="create.videoDesc"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="create.videoCheck" placeholder="请选择状态">
              <el-option
                v-for="item in videoChecks"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 创建弹窗底部区域 -->
    <template #footer>
      <span>
        <el-button @click="dialogCreateVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </span>
    </template>
    <!-- 创建弹窗底部区域 -->
  </el-dialog>
  <!-- 创建数据弹窗结束 -->

  <!-- 编辑弹窗开始 -->
  <el-dialog v-model="dialogEditVisible" title="编辑数据">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form :model="video">
          <el-form-item label="标题">
            <el-input
              v-model="video.videoTitle"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="video.videoDesc"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="video.videoCheck" placeholder="请选择状态">
              <el-option
                v-for="item in videoChecks"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 编辑弹窗底部区域 -->
    <template #footer>
      <span>
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </span>
    </template>
    <!-- 编辑弹窗底部区域 -->
  </el-dialog>
  <!-- 编辑弹窗结束 -->
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";
export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      videoChecks: [
        {
          name: "待发布",
          value: 0,
        },
        {
          name: "已发布",
          value: 1,
        },
        {
          name: "已下线",
          value: -1,
        },
        {
          name: "置顶",
          value: 2,
        },
      ],
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 200,
      },
      queryType: "0", //查询类型
      text: "", //查询值
      dialogCreateVisible: false, //创建数据的对话框
      dialogEditVisible: false, //编辑数据的对话框
      selectIds: [],
      breadcrumb: [{ name: "首页信息管理" }, { name: "视频信息管理" }],
      video: {},
      create: {
        videoTitle: "",
        videoDesc: "",
        videoCheck: "",
      },
    };
  },
  created() {
    this.getList(this.data.current, this.data.size);
  },

  methods: {
    // 根据条件查询数据
    quearyBy() {
      this.getList(this.data.current, this.data.size);
    },
    // 查询数据
    async getList(current, size) {
      const { data: res } = await this.axios.get("/video/getVideoList", {
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
      } else {
        this.$message.error("请求数据失败");
      }
    },
    // 选择时触发事件
    handleSelectionChange(val) {
      // 统计所选id
      this.selectIds = val.map((item) => item.videoId);
    },
    // pageSize每页数据量大小 改变时触发
    handleSizeChange(size) {
      this.size = size;
    },
    // current-change，单击页码时 改变时触发
    handleCurrentChange(current) {
      this.current = current;
      this.getList();
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
            const { data: res } = await this.axios.delete(
              "/video/delVideoByIds",
              {
                data: this.selectIds,
              }
            );
            if ((res.code = 200)) {
              this.$message.success("删除成功!");
              this.getList(this.data.current, this.data.size);
            } else {
              this.$message.error("删除失败!");
            }
          })
          .catch(() => {});
      } else {
        this.$message.warning("请先选择数据!");
      }
    },
    top(row) {
      if (row.videoCheck === "置顶") {
        this.$message.warning("该数据已是置顶状态!");
      } else {
        this.updateCheck("/putTop", row.videoId, "置顶成功");
      }
    },
    publish(row) {
      if (row.videoCheck === "已发布") {
        this.$message.warning("该数据已是发布状态!");
      } else {
        this.updateCheck("/putPublish", row.videoId, "发布成功");
      }
    },
    shelf(row) {
      if (row.videoCheck === "已下线") {
        this.$message.warning("该数据已是下线状态!");
      } else {
        this.updateCheck("/putShelf", row.videoId, "下线成功");
      }
    },

    async updateCheck(url, id, msg) {
      const { data: res } = await this.axios.put("/video" + url + "/" + id);
      if ((res.code = 200)) {
        this.$message.success(msg);
        this.getList(this.data.current, this.data.size);
      } else {
        this.$message.error("设置失败!");
      }
    },
    // 编辑按钮触发事件
    editById(row) {
      this.video = row;
      this.dialogEditVisible = true;
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
          const { data: res } = await this.axios.delete("/video/delVideoById", {
            params: {
              id: id,
            },
          });
          if ((res.code = 200)) {
            this.$message.success("删除成功!");
            this.getList(this.data.current, this.data.size);
          } else {
            this.$message.error("删除失败!");
          }
        })
        .catch(() => {});
    },
    // 编辑确认按钮事件
    onSubmit() {},
  },
};
</script>

<style>
</style>