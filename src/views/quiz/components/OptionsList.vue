<template>
  <el-dialog
    title="选项列表"
    v-model="dialogCheckVisibles"
    :before-close="beforeCheckClosed"
  >
    <el-row>
      <el-col :span="24">
        {{ data.records }}
        <el-table :data="data" max-height="550" border stripe>
          <el-table-column
            label="选项内容"
            prop="optionName"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="是否正确答案">
            <template #default="{ row }">
              <el-switch
                v-model="row.correctlyOrNot"
                size="large"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="正确"
                inactive-value="错误"
                active-text="正确"
                inactive-text="错误"
                @change="changeSwitch(row)"
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
import { toRefs } from "vue";
import qs from "qs";

export default {
  emits: ["dialogClosed"], // 抛出事件的名称
  props: {
    dialogCheckVisible: Boolean,
    belongId: String,
    dialogClosed: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      data: [],
      getListUrl: "options-table/getList", //获取题目信息的后台接口
      updateUrl: "options-table/update", //修改选项内容
      updateOffOrOnUrl: "options-table/updateOffOrOnById", //修改答案
      delByIdUrl: "options-table/delById",
    };
  },
  watch: {
    dialogCheckVisibles(val, oldVal) {
      if (val == true) {
        this.queryBy();
      }
    },
  },
  setup(props) {
    const { dialogCheckVisible: dialogCheckVisibles, belongId: belongIds } =
      toRefs(props);
    return { dialogCheckVisibles, belongIds };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  methods: {
    // 关闭弹窗前执行的方法
    beforeCheckClosed(done) {
      this.$emit("dialogClosed");
      done();
    },
    // 修改开关
    async changeSwitch(row) {
      row.correctlyOrNot == "正确" ? "错误" : "正确";
      const { data: res } = await this.axios.put(
        this.updateOffOrOnUrl,
        qs.stringify(row)
      );
      if (res.code == 200) {
        this.$message.success("修改成功!");
        // 是否修改成正确答案，是则同时修改其他数据，不再次请求后台
        if (row.correctlyOrNot == "正确") {
          for (var i = 0; this.data.length; i++) {
            if (this.data[i].id == row.id) {
              continue;
            } else {
              this.data[i].correctlyOrNot = "错误";
            }
          }
        }
      } else {
        this.$message.error("修改失败!");
        return false;
      }
    },
    // 根据条件查询数据
    queryBy() {
      this.getTableList();
    },
    // 查询数据
    async getTableList() {
      const { data: res } = await this.axios.get(this.getListUrl, {
        params: {
          belongId: this.belongIds,
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
        this.data = res.data;
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
    // 修改选项内容
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
          if (res.code == 403) {
            // 清空本地信息
            window.sessionStorage.clear();
            this.$message("登录已过期");
            this.$router.push("/login");
          }
          // 返回码进行判断
          else if (res.code == 200) {
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
          if (res.code == 403) {
            // 清空本地信息
            window.sessionStorage.clear();
            this.$message("登录已过期");
            this.$router.push("/login");
          }
          // 返回码进行判断
          else if (res.code == 200) {
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