<template>
  <Breadcrumb :infoTitles="breadcrumb" />

  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6" style="flex: none">
            <el-input v-model="text" placeholder="请输入搜索内容">
              <template #prepend> 垃圾名称 </template>
              <template #append>
                <el-button @click="queryBy">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="2">
            <el-button type="primary" @click="dialogCreateVisible = true">
              新增数据
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
                prop="name"
                label="垃圾名称"
                show-overflow-tooltip
              />
              <el-table-column prop="type" label="所属类型" />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" fixed="right" width="350">
                <template #default="{ row }">
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
          <el-form-item label="垃圾名称" prop="name">
            <el-input
              v-model="create.name"
              placeholder="请输入垃圾名称"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属类型" prop="type">
            <el-select v-model="create.type" placeholder="请选择">
              <el-option
                v-for="item in listType"
                :key="item"
                :value="item"
                :label="item"
              >
              </el-option>
            </el-select>
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
          :rules="formRules"
          ref="editForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="垃圾名称" prop="name">
            <el-input
              v-model="edit.name"
              placeholder="请输入垃圾名称"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属类型" prop="type">
            <el-select v-model="edit.type" placeholder="请选择">
              <el-option
                v-for="item in listType"
                :key="item"
                :value="item"
                :label="item"
              >
              </el-option>
            </el-select>
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
  <!-- 编辑弹窗结束 -->
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";
import qs from "qs";

// 校验规则
const formRules = {
  name: [
    {
      required: true, //必填
      message: "请输入垃圾名称", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 5, //最大长度
      message: "长度在 1 至 20 个字符", //提示
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true, //必填
      message: "请选择所属类型", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
};

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "搜索信息管理" }, { name: "搜索信息库" }],
      dialogChartVisible: false,
      getListUrl: "/search-library/getList", //获取数据的后台接口
      getListTypeUrl: "/search-library/getListType", //获取搜索类型数据的后台接口
      delByIdsUrl: "/search-library/delByIds", //批量删除的后台接口
      delByIdUrl: "/search-library/delById", //单一删除数据的后台接口
      createUrl: "search-library/create", //新增数据的后台接口
      updateUrl: "search-library/update", //修改数据的后台接口
      listType: [], //搜索类型集合
      text: "", //查询内容
      dialogCreateVisible: false, //创建数据的对话框
      dialogEditVisible: false, //编辑数据的对话框
      create: {
        name: "",
        type: "",
      },
      edit: {},
      formRules: formRules, //创建弹窗的验证规则
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

    // 编辑按钮触发事件
    editById(row) {
      // 深拷贝，使其不改变表格中的内容
      this.edit = qs.parse(qs.stringify(row));
      // 在字段中删除创建时间
      delete this.edit.createTime;
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

    async getListType() {
      const { data: res } = await this.axios.get(this.getListTypeUrl);
      // 返回码进行判断
      if (res.code == 200) {
        this.listType = res.data; //赋值搜索类型
        console.log(this.listType);
      } else {
        this.$message.error("请求数据失败");
      }
    },

    // 新增数据弹窗确认按钮事件
    onCreate() {
      this.$refs.createForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写正确信息!");
          return;
        } else {
          // 设置所属垃圾类型Id
          this.create.garbageId = this.belongId;
          const { data: res } = await this.axios.post(
            this.createUrl,
            qs.stringify(this.create)
          );
          if (res.code == 200) {
            this.$message.success("新增数据成功!");
            if (res.data == true) {
              this.dialogCreateVisible = false;
              // 重置表单
              this.$refs.createForm.resetFields();
              this.queryBy();
              return;
            }
          }
          this.$message.error("新增数据失败!");
        }
      });
    },

    // 编辑确认按钮事件
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
  },
};
</script>

<style>
</style>