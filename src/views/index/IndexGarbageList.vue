<template>
  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-page-header content="所属垃圾类型数据列表" @back="goBack" />
          </div>
        </template>
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6">
            <el-input v-model="text" placeholder="请输入搜索内容">
              <template #prepend> 名称 </template>
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

              <el-table-column label="所属垃圾类型" show-overflow-tooltip>
                <template #default>
                  {{ garbageTypeName }}
                </template>
              </el-table-column>
              <el-table-column
                prop="garbageName"
                label="名称"
                show-overflow-tooltip
              />
              <el-table-column label="图标" class-name="tableImageUrl">
                <template #default="{ row }">
                  <el-image
                    :src="httpResource + row.imgUrl"
                    style="height: 35px"
                  ></el-image>
                </template>
              </el-table-column>
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
          <el-form-item label="垃圾名称" prop="garbageName">
            <el-input
              v-model="create.garbageName"
              placeholder="请输入垃圾名称"
              show-word-limit
              maxlength="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="垃圾图标" prop="imgUrl">
            <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,accept限制上传格式,limit允许上传的最大数量,name上传的文件字段名 -->
            <el-upload
              v-model="create.imgUrl"
              :action="uploadImageUrl"
              list-type="picture-card"
              :multiple="false"
              :limit="1"
              accept=".png"
              name="imageFile"
              ref="createUploadImage"
              :on-success="createSuccessImage"
              :on-error="createErrorImage"
              :on-exceed="createExceedImage"
              :before-upload="uploadImage"
            >
              <template #default>
                <el-icon><plus /></el-icon>
              </template>
              <template #file="{ file }">
                <div>
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="createHandleRemoveImage(file)"
                    >
                      <el-icon><delete /></el-icon>
                    </span>
                  </span>
                </div>
              </template>
              <template #tip>
                <div class="el-upload__tip">
                  仅支持png格式图片,建议54*54像素
                </div>
              </template>
            </el-upload>
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
          <el-form-item label="垃圾名称" prop="garbageName">
            <el-input
              v-model="edit.garbageName"
              placeholder="请输入垃圾名称"
              show-word-limit
              maxlength="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="垃圾图标" prop="imgUrl">
            <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,limit允许上传的最大数量 -->
            <el-upload
              v-model="edit.imgUrl"
              :action="uploadImageUrl"
              list-type="picture-card"
              :multiple="false"
              accept=".png"
              name="imageFile"
              :limit="1"
              ref="editUploadImage"
              :file-list="editImageList"
              :on-success="editSuccessImage"
              :on-error="editErrorImage"
              :on-exceed="editExceedImage"
              :before-upload="uploadImage"
            >
              <template #default>
                <el-icon><plus /></el-icon>
              </template>
              <template #file="{ file }">
                <div>
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    :style="'background-color:' + edit.bgColor"
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="editHandleRemoveImage(file)"
                    >
                      <el-icon><delete /></el-icon>
                    </span>
                  </span>
                </div>
              </template>
              <template #tip>
                <div class="el-upload__tip">
                  仅支持png格式图片,建议54*54像素
                </div>
              </template>
            </el-upload>
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
  garbageName: [
    {
      required: true, //必填
      message: "请输入垃圾名称", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 5, //最大长度
      message: "长度在 1 至 5 个字符", //提示
      trigger: "blur",
    },
  ],
  imgUrl: [
    {
      required: true, //必填
      message: "请上传垃圾图标", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
};

export default {
  components: { Pagination },
  data() {
    return {
      garbageTypeName: this.$route.query.garbageTypeName, //上一页面传值所属垃圾类型名称
      belongId: this.$route.query.belongId, //上一页面传值所属垃圾类型id
      httpResource: this.$httpResource,
      uploadImageUrl: this.axios.defaults.baseURL + "garbage-list/uploadImage", //上传图片文件地址
      getListUrl: "/garbage-list/getList", //获取的数据的后台接口
      delByIdsUrl: "/garbage-list/delByIds", //批量删除的后台接口
      delByIdUrl: "/garbage-list/delById", //单一删除数据的后台接口
      createUrl: "garbage-list/create", //新增数据的后台接口
      updateUrl: "garbage-list/update", //修改数据的后台接口
      editVideoList: [],
      editImageList: [],
      text: "", //查询内容
      checkVideoUrl: "", //查看的视频url地址
      dialogCreateVisible: false, //创建数据的对话框
      dialogEditVisible: false, //编辑数据的对话框
      selectIds: [],
      create: {
        garbageName: "",
        imgUrl: "",
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

    // 编辑按钮触发事件
    editById(row) {
      // 深拷贝，使其不改变表格中的内容
      this.edit = qs.parse(qs.stringify(row));
      // 在字段中删除创建时间与分享量
      delete this.edit.createTime;
      delete this.edit.garbageLists;

      const imgUrl = row.imgUrl.split("/");
      const videoUrl = row.videoUrl.split("/");
      // 编辑弹窗显示的图片
      this.editImageList[0] = {
        name: imgUrl[imgUrl.length - 1],
        url: this.httpResource + row.imgUrl,
      };
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

    /**新增数据所需方法开始 */
    // 新建数据弹窗上传图片成功触发事件
    createSuccessImage(response, file, fileList) {
      if (response.code == 200) {
        file.url = this.httpResource + response.data;
        this.create.imgUrl = response.data;
        this.$message.success("上传图片成功");
      } else {
        this.$message.error("上传图片失败");
      }
    },
    // 新建数据弹窗上传图片失败触发事件
    createErrorImage(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    //新增数据弹窗中上传图片超出数量限制时触发事件
    createExceedImage(files, fileList) {
      this.$messageBox
        .confirm("确定覆盖前一个文件?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.create.videoImg = null;
          // 先清除原来的文件
          this.$refs.createUploadImage.handleRemove(fileList[0]);
          // 再添加选择的文件
          this.$refs.createUploadImage.handleStart(files[0]);
          this.$message.success("操作成功");
          // 进行上传
          this.$refs.createUploadImage.submit();
        })
        .catch(() => {});
    },
    // 新增数据弹窗中的文件略缩图删除触发事件
    createHandleRemoveImage(file) {
      // 删除该文件
      this.$refs.createUploadImage.handleRemove(file);
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
              // 重置表单与清除上传的文件
              this.$refs.createForm.resetFields();
              this.$refs.createUploadImage.clearFiles();
              this.queryBy();
              return;
            }
          }
          this.$message.error("新增数据失败!");
        }
      });
    },
    /**新增数据所需方法结束 */

    /**
     * 上传前所需判断的方法 开始
     */
    // 上传前验证图片格式。避免出现格式选择错误
    uploadImage(file) {
      const typeList = ["png", "PNG"];
      // file.type.split分割格式
      if (typeList.indexOf(file.type.split("/")[1]) < 0) {
        this.$message.error("文件格式不符合!");
        return false;
      }
    },
    /**
     * 上传前所需判断的方法 结束
     */

    // 编辑数据所需方法开始
    // 编辑数据弹窗上传图片成功触发事件
    editSuccessImage(response, file, fileList) {
      if (response.code == 200) {
        file.url = this.httpResource + response.data;
        this.edit.imgUrl = response.data;
        this.$message.success("上传图片成功");
      } else {
        this.$message.error("上传图片失败");
      }
    },
    // 编辑数据弹窗上传图片失败触发事件
    editErrorImage(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    // 编辑窗体中上传图片超出数量限制时触发事件
    editExceedImage(files, fileList) {
      this.$messageBox
        .confirm("确定覆盖前一个文件?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.edit.imgUrl = null;
          // 先清除原来的文件
          this.$refs.editUploadImage.handleRemove(fileList[0]);
          // 再添加选择的文件
          this.$refs.editUploadImage.handleStart(files[0]);
          this.$message.success("操作成功");
          // 进行上传
          this.$refs.editUploadImage.submit();
        })
        .catch(() => {});
    },

    // 编辑数据弹窗中的文件略缩图删除触发事件
    editHandleRemoveImage(file) {
      // 删除该文件
      this.$refs.editUploadImage.handleRemove(file);
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