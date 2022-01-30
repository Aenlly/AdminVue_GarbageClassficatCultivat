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
              <template #prepend> 类型名称 </template>
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
              max-height="550"
              border
              stripe
            >
              <el-table-column type="selection" width="55" />
              <el-table-column fixed type="index" label="序号" width="60" />
              <el-table-column prop="typeName" label="类型名称" />
              <el-table-column label="图标" width="100">
                <template #default="{ row }">
                  <el-tooltip content="单击预览" placement="bottom">
                    <el-image
                      :src="httpResource + row.imgUrl"
                      style="height: 80px"
                      :preview-src-list="[httpResource + row.imgUrl]"
                      fit="contain"
                    ></el-image>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="giftShow"
                label="小程序是否显示"
                width="150"
              />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" fixed="right" width="120">
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
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";
import qs from "qs";

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "礼品信息管理" }, { name: "礼品类型管理" }],
      getListUrl: "/gift-type/getList", //获取礼品信息的后台接口
      delByIdsUrl: "gift-type/delByIds", //批量删除的后台接口
      delByIdUrl: "/gift-type/delById", //单一删除数据的后台接口
      createUrl: "gift-type/create", //新增数据的后台接口
      updateUrl: "gift-type/update", //修改数据的后台接口
      dialogCreateVisible: false, //创建数据的对话框
      dialogEditVisible: false, //编辑数据的对话框
      text: "",
      edit: {},
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
      create: {
        giftName: "",
        giftDesc: "",
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
  },
};
</script>

<style>
</style>