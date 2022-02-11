<template>
  <Breadcrumb :infoTitles="breadcrumb" />
  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-page-header content="所属题库题目数据列表" @back="goBack" />
          </div>
        </template>
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6">
            <el-input v-model="text" placeholder="请输入搜索内容">
              <template #prepend> 题目信息 </template>
              <template #append>
                <el-button @click="queryBy">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <!-- 搜索区结束 -->

          <el-col :span="2">
            <el-button type="primary" @click="dialogImportVisible = true">
              导入题目
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="deleteByIds"
              >删除所选</el-button
            ></el-col
          >
        </el-row>
        <!-- 数据区域容器结束 -->
        <!-- 数据表格容器开始,selection-change当选择项发生变化时会触发该事件 -->
        <el-row>
          <el-col :span="24">
            <el-table
              :data="data.records"
              style="width: 100%"
              max-height="620"
              @selection-change="handleSelectionChange"
              border
              stripe
            >
              <el-table-column type="selection" width="55" />
              <el-table-column fixed type="index" label="序号" width="60" />
              <el-table-column
                prop="topicName"
                label="题目"
                show-overflow-tooltip
              />
              <el-table-column
                prop="analysis"
                label="题目解析"
                show-overflow-tooltip
              />
              <el-table-column prop="score" label="分值" />
              <el-table-column label="操作" fixed="right" width="160">
                <template #default="{ row }">
                  <el-tooltip content="查看题目选项" placement="bottom">
                    <el-button
                      icon="el-icon-view"
                      size="small"
                      @click="onCheck(row.id)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑数据" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="small"
                      @click="onEdit(row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除数据" placement="bottom">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="deleteById(row.id)"
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
  <el-dialog title="导入数据" v-model="dialogImportVisible">
    <el-space direction="vertical" style="width: 100%" :size="50">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-steps :active="stepActive" align-center finish-status="success">
            <el-step title="上传EXECL" description=""></el-step>
            <el-step title="导入数据" description=""></el-step>
            <el-step title="完成导入" description=""></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row align="center">
        <el-col :span="24">
          <el-upload
            v-model="execl"
            drag
            :action="uploadVideoUrl"
            ref="editUploadVideo"
            accept=".xls"
            name="videoFile"
            :multiple="false"
            :file-list="editVideoList"
            :limit="1"
            :on-success="editSuccessVideo"
            :on-error="editErrorVideo"
            :on-exceed="editExceedVideo"
            :before-upload="uploadVideo"
          >
            <el-icon class="el-icon-upload"></el-icon>
            <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">大小小于10MB的xls文件</div>
            </template>
          </el-upload>
        </el-col>
      </el-row>
    </el-space>
    <el-row align="bottom">
      <el-col :span="24">
        <span
          style="font-size: 16px; cursor: pointer; color: #409eff"
          @click="downloadFile"
        >
          下载模版
        </span>
        <span style="font-size: 16px; color: #5d5d5d">
          ，请根据模板填充数据后再上传
        </span>
      </el-col>
    </el-row>
  </el-dialog>
  <OptionsList
    :dialogCheckVisible="dialogCheckVisible"
    :belongId="titleBelongId"
  />
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Pagination from "@/components/Pagination.vue";
import OptionsList from "@/views/quiz/components/OptionsList";
import qs from "qs";

export default {
  components: { Breadcrumb, Pagination, OptionsList },
  data() {
    return {
      breadcrumb: [
        { name: "知识测验管理" },
        { name: "题库信息管理" },
        { name: "题库信息列表" },
      ],
      belongId: this.$route.query.belongId, //上一页面传值所属id
      getListUrl: "subject-table/getList", //获取题目信息的后台接口
      getExcelFileUrl: "subject-table/getExcelFile",
      dialogImportVisible: false, //导入弹窗的对话框
      titleBelongId: "", //所属题目的编号
      stepActive: 1, //步骤条的索引
      text: "", //查询内容
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
    // 选择时触发事件
    handleSelectionChange(val) {
      // 统计所选id
      this.selectIds = val.map((item) => item.id);
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
    // 查看选项内容
    onCheck(id) {
      this.titleBelongId = id;
      this.dialogCheckVisible = true;
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

    async downloadFile() {
      const { data: res } = await this.axios.get(this.getExcelFileUrl, {
        responseType: "blob",
      });
      console.log(res);
      if (res != null) {
        let blob = new Blob([res], { type: "application/force-download" });
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement("a"); // 创建a标签
        link.href = url;
        link.download = "题目导入模板.xls"; // 重命名文件
        link.click();
        URL.revokeObjectURL(url); // 释放内存
      }
    },
  },
};
</script>

<style>
</style>