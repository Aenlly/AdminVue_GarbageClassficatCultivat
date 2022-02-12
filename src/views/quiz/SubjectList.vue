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
            <el-button type="primary" @click="dialogCreateVisible = true">
              新增题目
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
                label="题目信息"
                show-overflow-tooltip
              />
              <el-table-column
                prop="analysis"
                label="题目解析"
                show-overflow-tooltip
              />
              <el-table-column prop="score" label="题目分值" />
              <el-table-column label="操作" fixed="right" width="120">
                <template #default="{ row }">
                  <el-row>
                    <el-col :span="12">
                      <el-tooltip content="查看题目选项" placement="bottom">
                        <el-button
                          icon="el-icon-view"
                          size="small"
                          @click="onCheck(row.id)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="12">
                      <el-tooltip content="添加选项" placement="bottom">
                        <el-button
                          type="success"
                          icon="el-icon-plus"
                          size="small"
                          @click="onOptionCreate(row.id)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-col :span="12">
                      <el-tooltip content="编辑数据" placement="bottom">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          size="small"
                          @click="editById(row)"
                        ></el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="12">
                      <el-tooltip content="删除数据" placement="bottom">
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          size="small"
                          @click="deleteById(row.id)"
                        ></el-button>
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
      <el-row align="center" v-if="stepActive == 1">
        <el-col :span="24">
          <el-upload
            drag
            :action="uploadExcelFileUrl"
            ref="uploadFile"
            accept=".xls"
            name="excelFile"
            :multiple="false"
            :file-list="fileList"
            :limit="1"
            :on-success="successFile"
            :on-error="errorFile"
            :on-exceed="exceedFile"
            :on-progress="progressFile"
            :before-upload="beforeUploadFile"
          >
            <el-icon class="el-icon-upload"></el-icon>
            <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">大小小于10MB的xls文件</div>
            </template>
          </el-upload>
        </el-col>
      </el-row>
      <el-row align="center" v-if="stepActive == 2" style="height: 300px">
        <el-col :span="24"
          ><el-skeleton v-loading="true" element-loading-text="Loading..." />
        </el-col>
      </el-row>
      <el-row align="center" v-if="stepActive == 3">
        <el-col :span="24">
          <el-row>
            <el-col :span="24">
              <el-icon size="50" color="#67c23a"><check /></el-icon>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="success" @click="dialogImportVisible = false">
                导入完成
              </el-button>
            </el-col>
          </el-row>
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
    v-on:dialogClosed="dialogClosed"
  />

  <!-- 新增数据弹窗开始 -->
  <el-dialog v-model="dialogCreateVisible" title="新增数据">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form
          :model="create"
          ref="createForm"
          :rules="formRules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="题目信息" prop="topicName">
            <el-input
              v-model="create.topicName"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入题目信息"
            ></el-input>
          </el-form-item>
          <el-form-item label="题目解析" prop="analysis">
            <el-input
              v-model="create.analysis"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入题目解析"
            ></el-input>
          </el-form-item>
          <el-form-item label="题目分值" prop="score">
            <el-input-number
              v-model="create.score"
              :min="1"
              :max="100"
              placeholder="请输入题目分值"
              style="width: 230px"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 创建弹窗底部区域 -->
    <template #footer>
      <span>
        <el-button @click="dialogCreateVisible = false">取消</el-button>
        <el-button type="primary" @click="onCreate">确认</el-button>
      </span>
    </template>
    <!-- 创建弹窗底部区域 -->
  </el-dialog>
  <!-- 新增数据弹窗结束 -->

  <!-- 编辑弹窗开始 -->
  <el-dialog v-model="dialogEditVisible" title="编辑数据">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form
          :model="edit"
          ref="editForm"
          :rules="formRules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="题目信息" prop="topicName">
            <el-input
              v-model="edit.topicName"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入题目信息"
            ></el-input>
          </el-form-item>
          <el-form-item label="题目解析" prop="analysis">
            <el-input
              v-model="edit.analysis"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入题目解析"
            ></el-input>
          </el-form-item>
          <el-form-item label="题目分值" prop="score">
            <el-input-number
              v-model="edit.score"
              :min="1"
              :max="100"
              placeholder="请输入题目分值"
              style="width: 230px"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 编辑弹窗底部区域 -->
    <template #footer>
      <span>
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="onEdit">确认</el-button>
      </span>
    </template>
    <!-- 编辑弹窗底部区域 -->
  </el-dialog>
  <!-- 编辑数据弹窗结束 -->
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import Pagination from "@/components/Pagination.vue";
import OptionsList from "@/views/quiz/components/OptionsList";
import qs from "qs";

// 校验规则
const formRules = {
  topicName: [
    {
      required: true, //必填
      message: "请输入题目信息", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 50, //最大长度
      message: "长度在 1 至 50 个字符", //提示
      trigger: "blur",
    },
  ],
  analysis: [
    {
      required: true, //必填
      message: "请输入题目解析", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 200, //最大长度
      message: "长度在 1 至 200 个字符", //提示
      trigger: "blur",
    },
  ],
  score: [
    {
      required: true, //必填
      message: "请输入题目分值", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      type: "number",
      message: "必须是数字", //提示
      trigger: "blur",
    },
  ],
};

export default {
  components: { Breadcrumb, Pagination, OptionsList },
  data() {
    return {
      breadcrumb: [
        { name: "知识测验管理" },
        { name: "题库信息管理" },
        { name: "题库信息列表" },
      ],
      belongId: this.$route.query.belongId, //上一页面传值所属题库id
      getListUrl: "subject-table/getList", //获取题目信息的后台接口
      uploadExcelFileUrl:
        this.axios.defaults.baseURL +
        "subject-table/uploadExcelFile/" +
        this.$route.query.belongId, //导入题目文件的接口
      getExcelFileUrl: "subject-table/getExcelFile", //获取导入模板的接口
      createUrl: "subject-table/create", //新增题目请求接口
      createOptionUrl: "options-table/create", //新增选项请求接口
      delByIdUrl: "subject-table/delById", //单一删除的后台接口
      delByIdsUrl: "subject-table/delByIds", //批量删除的后台接口
      updateUrl: "subject-table/update", //更新请求接口
      dialogImportVisible: false, //导入弹窗的对话框
      dialogCreateVisible: false, //新增数据的对话框
      dialogEditVisible: false, //编辑数据的对话框
      dialogCheckVisible: false, //选项数据的弹窗
      titleBelongId: "", //所属题目的编号
      stepActive: 2, //步骤条的索引
      text: "", //查询内容
      fileList: [], //上传的文件集合
      formRules: formRules, //创建弹窗的验证规则
      edit: {},
      create: {
        databankId: this.$route.query.belongId,
      },
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
    /**
     * 题目导入所需方法开始
     */
    //下载导入模板方法
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

    // 上传前验证文件格式。避免出现格式选择错误
    beforeUploadFile(file) {
      const typeList = ["vnd.ms-excel"];
      // file.type.split分割格式
      if (typeList.indexOf(file.type.split("/")[1]) < 0) {
        this.$message.error("文件格式不符合!");
        return false;
      }
    },

    // 题目导入数据弹窗上传文件成功触发事件
    successFile(response, file, fileList) {
      if (response.code == 200) {
        this.stepActive = 3;
        this.$message.success("导入成功");
      } else {
        this.stepActive = 1;
        this.$message.error("导入失败");
      }
    },
    progressFile(event, file, fileList) {
      this.stepActive = 2;
    },
    // 新建数据弹窗上传文件失败触发事件
    errorFile(err, file, fileList) {
      this.$message.error("上传文件失败");
    },
    //新增数据弹窗中上传图片超出数量限制时触发事件
    exceedFile(files, fileList) {
      this.$messageBox
        .confirm("确定覆盖前一个文件?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.excelFile = null;
          // 先清除原来的文件
          this.$refs.uploadFile.handleRemove(fileList[0]);
          // 再添加选择的文件
          this.$refs.uploadFile.handleStart(files[0]);
          this.$message.success("操作成功");
          // 进行上传
          this.$refs.uploadFile.submit();
        })
        .catch(() => {});
    },
    //导入所需方法结束

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
    // 编辑按钮触发事件
    editById(row) {
      // 深拷贝，使其不改变表格中的内容
      this.edit = qs.parse(qs.stringify(row));
      this.edit.score = Number(this.edit.score);
      // 显示的图片
      this.dialogEditVisible = true;
    },
    // 新增选项，题目编号
    onOptionCreate(belongId) {
      this.$messageBox
        .prompt("请输入新增的选项(默认为错误答案)", "新增选项窗口", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /[\s\S]{1,200}/,
          inputErrorMessage: "请输入选项,长度必须大于2小于200个字符",
        })
        .then(async ({ value }) => {
          const info = { optionName: value, belongTopicId: belongId };
          const { data: res } = await this.axios.post(
            this.createOptionUrl,
            qs.stringify(info)
          );
          if (res.code == 200) {
            if (res.data === true) {
              this.$message.success("新增数据成功!");
              return;
            }
            this.$message.success("选项数量已上限!");
          }
          this.$message.error("新增数据失败!");
        })
        .catch(() => {});
    },
    // 新增数据弹窗确认按钮事件
    onCreate() {
      this.$refs.createForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写正确信息!");
          return;
        } else {
          const { data: res } = await this.axios.post(
            this.createUrl,
            qs.stringify(this.create)
          );
          if (res.code == 200) {
            this.$message.success("新增数据成功!");
            if (res.data === true) {
              // 重置表单与清除上传的文件
              this.$refs.createForm.resetFields();
              this.dialogCreateVisible = false;
              this.queryBy();
              return;
            }
          }
          this.$message.error("新增数据失败!");
        }
      });
    },
    /**新增数据所需方法结束 */
    //编辑弹窗的确认事件
    onEdit() {
      // 校验表单
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写正确信息!");
          return;
        } else {
          const { data: res } = await this.axios.put(
            this.updateUrl,
            qs.stringify(this.edit)
          );
          if (res.code == 200) {
            if (res.data === true) {
              this.$message.success("保存数据成功!");
              // 关闭弹窗
              this.dialogEditVisible = false;
              // 刷新数据
              this.queryBy();
              return;
            }
          }
          this.$message.error("保存数据失败!");
        }
      });
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
    // 选项弹窗关闭事件
    dialogClosed() {
      this.dialogCheckVisible = false;
    },
  },
};
</script>

<style>
</style>