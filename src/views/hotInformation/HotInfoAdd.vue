<template>
  <el-row style="height: 600px">
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-page-header content="新增热门资讯" @back="goBack" />
          </div>
        </template>
        <el-row>
          <el-col :span="24">
            <el-form :model="create" :rules="formRules" ref="createForm">
              <el-form-item label="资讯标题" prop="hotInfoTitle">
                <el-input
                  v-model="create.hotInfoTitle"
                  placeholder="请输入资讯标题"
                  show-word-limit
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="资讯描述" prop="hotInfoTitle">
                <el-input
                  v-model="create.hotInfoDesc"
                  :autosize="{ minRows: 3, maxRows: 4 }"
                  type="textarea"
                  show-word-limit
                  maxlength="200"
                  placeholder="请输入资讯描述"
                ></el-input>
              </el-form-item>
              <el-form-item label="文章来源" prop="sourceText">
                <el-input
                  v-model="create.sourceText"
                  show-word-limit
                  maxlength="50"
                  placeholder="请输入文章来源"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="发布时间" prop="releaseTime">
                <el-date-picker
                  v-model="create.releaseTime"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  type="date"
                  placeholder="请选择发布时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="资讯封面" prop="imgUrl">
                <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,limit允许上传的最大数量 -->
                <el-upload
                  v-model="create.imgUrl"
                  :action="uploadImageUrl"
                  list-type="picture-card"
                  :multiple="false"
                  accept=".jpg,.png,.jpeg"
                  name="imageFile"
                  :limit="1"
                  ref="createUploadImage"
                  :file-list="createImageList"
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
              <el-form-item label="资讯内容" prop="hotInfoText">
                <Editor
                  v-model="create.hotInfoText"
                  v-on:onchangeEditor="onchangeEditor"
                  v-on:editorInit="editorInit"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <el-button type="primary" @click="onCreate">保存</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="danger" @click="goBack">取消</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Editor from "@/components/Editor";
import qs from "qs";

// 校验规则
const formRules = {
  hotInfoTitle: [
    {
      required: true, //必填
      message: "请输入资讯标题", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 50, //最大长度
      message: "长度在 1 至 50 个字符", //提示
      trigger: "blur",
    },
  ],
  hotInfoDesc: [
    {
      required: true, //必填
      message: "请输入资讯描述", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 200, //最大长度
      message: "长度在 1 至 200 个字符", //提示
      trigger: "blur",
    },
  ],
  releaseTime: [
    {
      required: true, //必填
      message: "请选择显示的发布时间", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
  hotInfoText: [
    {
      required: true, //必填
      message: "请输入资讯内容", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      message: "请输入资讯内容",
      trigger: "blur",
    },
  ],
  sourceText: [
    {
      required: true, //必填
      message: "请输入资讯来源", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 50, //最大长度
      message: "请输入资讯来源",
      trigger: "blur",
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
  components: {
    Editor: Editor,
  },
  data() {
    return {
      httpResource: this.$httpResource,
      uploadImageUrl: this.axios.defaults.baseURL + "hot-info/uploadImage", //上传图片文件地址
      createUrl: "hot-info/create",
      createImageList: [],
      formRules: formRules, //创建弹窗的验证规则
      create: {
        hotInfoTitle: "",
        hotInfoDesc: "",
        hotInfoText: "",
        releaseTime: "",
        sourceText: "",
        imgUrl: "",
      },
      editor: "", //富文本组件
    };
  },
  methods: {
    //   返回上一页
    goBack() {
      this.$router.go(-1);
    },
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

    // 上传所需方法开始
    // 上传图片成功触发事件
    createSuccessImage(response, file, fileList) {
      if (response.code == 200) {
        file.url = this.httpResource + response.data;
        this.create.imgUrl = response.data;
        this.$message.success("上传图片成功");
      } else {
        this.$message.error("上传图片失败");
      }
    },
    // 上传图片失败触发事件
    createErrorImage(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    // 上传图片超出数量限制时触发事件
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
          this.$message.success("操作成功");
          // 再添加选择的文件
          this.$refs.createUploadImage.handleStart(files[0]);
          // 进行上传
          this.$refs.createUploadImage.submit();
        })
        .catch(() => {});
    },

    // 文件略缩图删除触发事件
    createHandleRemoveImage(file) {
      // 删除该文件
      this.$refs.createUploadImage.handleRemove(file);
    },
    onCreate() {
      console.log(this.create);
      // 校验表单
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
            if (res.data === true) {
              this.$message.success("新增数据成功!");
              // 刷新数据
              this.$router.go(-1);
              return;
            }
          }
          this.$message.error("新增数据失败!");
        }
      });
    },
    // 将富文本中的值赋值到表单模型中
    async onchangeEditor(newHtml) {
      this.create.hotInfoText = newHtml;
    },
    // 获取子组件创建的富文本组件到父组件中，可能存在获取数据的先后问题，所以需要进行监听edit的值，从而达到更改富文本的初始值
    async editorInit(editor) {
      this.editor = editor;
    },
  },
};
</script>

<style>
</style>