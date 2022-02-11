<template>
  <el-dialog title="选项列表" v-model="dialogCheckVisibles">
    <el-row>
      <el-col :span="24">
        <el-table :data="data.records" max-height="550" border stripe>
          <el-table-column
            label="选项内容"
            prop="optionName"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column label="是否正确答案">
            <template #default="{ row }">
              <el-switch
                v-model="row.correctlyOrNot"
                inline-prompt
                size="large"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="正确"
                inactive-text="错误"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template #default="{ row }">
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
  </el-dialog>
</template>

<script>
import { toRefs,onBeforeMount } from "vue";
import qs from "qs";

export default {
  props: {
    dialogCheckVisible: Boolean,
    belongId: String,
  },
  data() {
    return {
      getListUrl: "options-table/getList", //获取题目信息的后台接口
      updateUrl: "options-table/update",
      delByIdUrl: "options-table/delById",
    };
  },
  setup(props) {
    const { dialogCheckVisible: dialogCheckVisibles, belongId: belongIds } =
      toRefs(props);
      onBeforeMount(()=>{
// 根据条件查询数据
    queryBy() {
      this.getTableList();
    },
      })
    this.queryBy();
    return { dialogCheckVisibles, belongIds };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  methods: {
    
    // 查询数据
    async getTableList() {
      const { data: res } = await this.axios.get(this.getListUrl, {
        params: {
          belongId: this.belongIds,
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
    onEdit(row) {
      this.$messageBox
        .prompt("请输入修改后的选项", "修改窗口", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /[\s\S]{1,200}/,
          inputValue: row.optionName,
          inputErrorMessage: "请输入选项内容,长度必须大于2小于200个字符",
        })
        .then(async ({ value }) => {
          const info = { id: row.id, optionName: value };
          const { data: res } = await this.axios.put(
            this.updateUrl,
            qs.stringify(info)
          );
          if (res.code == 200) {
            this.$message.success("修改数据成功!");
            if (res.data === true) {
              row.optionName = value;
              return;
            }
          }
          this.$message.error("修改数据失败!");
        })
        .catch(() => {});
    },

    // 删除选项按钮触发事件
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