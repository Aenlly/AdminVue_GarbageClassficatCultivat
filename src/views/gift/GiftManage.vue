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
                  <el-option label="礼品名称" value="0"></el-option>
                  <el-option label="礼品描述" value="1"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button @click="queryBy">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <!-- 搜索区结束 -->
          <!-- 远程搜索，filterable启用筛选，remote是可以远程搜索，remote-method远程搜索对应的函数，loading是否正在从远程获取数据 -->
          <el-col :span="4">
            <el-select
              v-model="giftType"
              style="width: 165px"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <template #prefix>礼品类型：</template>
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>

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
              <el-table-column prop="giftId" label="礼品编号" />
              <el-table-column
                prop="giftName"
                label="礼品名称"
                show-overflow-tooltip
              />
              <el-table-column
                prop="giftDesc"
                label="礼品描述"
                show-overflow-tooltip
              />
              <el-table-column prop="point" label="所需积分" />
              <el-table-column prop="price" label="市场价" />
              <el-table-column prop="number" label="库存数量" />
              <el-table-column prop="sold" label="已售数量" />
              <el-table-column prop="browseCount" label="浏览量" />
              <el-table-column label="礼品类型" width="90">
                <template #default="{ row }">
                  <div class="name-wrapper">
                    <el-tag>{{ row.typeName }}</el-tag>
                  </div>
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
                      @click="deleteById(row.giftId)"
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
  <el-dialog v-model="dialogCreateVisible" title="新增数据" top="5vh">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form
          :model="create"
          ref="createForm"
          :rules="formRules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="礼品名称" prop="giftName">
            <el-input
              v-model="create.giftName"
              placeholder="请输入名称"
              show-word-limit
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="礼品描述" prop="giftDesc">
            <el-input
              v-model="create.giftDesc"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="所需积分" prop="point">
            <el-input-number
              v-model="create.point"
              :min="1"
              placeholder="请输入礼品兑换所需积分"
              style="width: 230px"
            />
          </el-form-item>
          <el-form-item label="市场价" prop="price">
            <el-input-number
              v-model="create.price"
              placeholder="请输入礼品市场价"
              :precision="2"
              :step="0.1"
              :min="1"
              style="width: 230px"
            />
          </el-form-item>
          <el-form-item label="封面" prop="imgUrl">
            <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,accept限制上传格式,limit允许上传的最大数量,name上传的文件字段名 -->
            <el-upload
              v-model="create.imgUrl"
              :action="uploadImageUrl"
              list-type="picture-card"
              :multiple="false"
              :limit="1"
              accept=".jpg,.png,.jpeg"
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
                <div class="el-upload__tip">仅支持jpg/jpeg/png格式图片</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="礼品类型" prop="typeId">
            <el-select
              v-model="create.typeId"
              placeholder="请选择礼品类型"
              filterable
              remote
              :remote-method="createRemoteMethod"
              :loading="createLoading"
            >
              <el-option
                v-for="item in createOptions"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存数量" prop="number">
            <el-input-number
              v-model="create.number"
              :min="1"
              placeholder="请输入库存量"
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
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";
import qs from "qs";

// 校验规则
const formRules = {
  giftName: [
    {
      required: true, //必填
      message: "请输入标题", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 50, //最大长度
      message: "长度在 1 至 50 个字符", //提示
      trigger: "blur",
    },
  ],
  giftDesc: [
    {
      required: true, //必填
      message: "请输入描述", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 200, //最大长度
      message: "长度在 1 至 200 个字符", //提示
      trigger: "blur",
    },
  ],
  point: [
    {
      required: true, //必填
      message: "请输入兑换所需积分", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      type: "number",
      message: "请输入兑换所需积分", //提示
      trigger: "blur",
    },
  ],
  price: [
    {
      required: true, //必填
      message: "请输入礼品市场价", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      type: "number",
      message: "必须是数字", //提示
      trigger: "blur",
    },
  ],
  number: [
    {
      required: true, //必填
      message: "请输入库存数量", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      type: "number",
      message: "必须是数字", //提示
      trigger: "blur",
    },
  ],
  typeId: [
    {
      required: true, //必填
      message: "请选择礼品类型", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
  imgUrl: [
    {
      required: true, //必填
      message: "请上传封面", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
};

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "礼品信息管理" }, { name: "礼品信息管理" }],
      httpResource: this.$httpResource,
      uploadImageUrl: this.axios.defaults.baseURL + "gift/uploadImage", //上传图片文件地址
      getListUrl: "/gift/getList", //获取礼品信息的后台接口
      delByIdsUrl: "/gift/delByIds", //批量删除的后台接口
      delByIdUrl: "/gift/delById", //单一删除数据的后台接口
      createUrl: "gift/create", //新增数据的后台接口
      getSelectListByUrl: "/gift-type/getSelectListBy", //获取礼品类型选择列表的后台接口
      dialogCreateVisible: false, //创建数据的对话框
      queryType: 0,
      text: "",
      giftType: "",
      loading: false,
      options: [],
      data: {
        current: 1, //当前页
        size: 10, //每页数据量
        total: 0, //总数据量
      },
      formRules: formRules, //创建弹窗的验证规则
      createLoading: false,
      createOptions: [],
      create: {
        giftName: "",
        giftDesc: "",
        imgUrl: "",
        point: 1,
        price: 1.0,
        typeId: "",
        number: 0,
      },
    };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  created() {
    this.queryBy();
    this.remoteMethod("");
    this.createRemoteMethod("");
  },
  // 监听变化的值
  watch: {
    //   监听礼品类型状态选项框，使其变动时，重新赋值
    giftType(val, oldVal) {
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
          giftType: this.giftType,
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
      this.selectIds = val.map((item) => item.giftId);
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

    // 选择器远程搜索方法
    async remoteMethod(query) {
      this.loading = true;
      const { data: res } = await this.axios.get(this.getSelectListByUrl, {
        params: {
          text: query,
        },
      });
      // 返回码进行判断
      if (res.code == 200) {
        this.options = res.data;
      } else {
        this.$message.error("请求数据失败");
      }
      this.loading = false;
    },

    /**新增数据所需方法开始 */
    async createRemoteMethod(query) {
      this.createLoading = true;
      const { data: res } = await this.axios.get(this.getSelectListByUrl, {
        params: {
          text: query,
        },
      });
      // 返回码进行判断
      if (res.code == 200) {
        this.createOptions = res.data;
      } else {
        this.$message.error("请求数据失败");
      }
      this.createLoading = false;
    },
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
          this.create.imgUrl = null;
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
          const { data: res } = await this.axios.post(
            this.createUrl,
            qs.stringify(this.create)
          );
          if (res.code == 200) {
            this.$message.success("新增数据成功!");
            if (res.data === true) {
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
      const typeList = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
      // file.type.split分割格式
      if (typeList.indexOf(file.type.split("/")[1]) < 0) {
        this.$message.error("文件格式不符合!");
        return false;
      }
    },
    /**
     * 上传前所需判断的方法 结束
     */
  },
};
</script>

<style>
</style>