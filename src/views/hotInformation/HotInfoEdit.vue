<template>
  <el-row style="height: 600px">
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-page-header content="编辑热门资讯" @back="goBack" />
          </div>
        </template>
        <el-row>
          <el-col :span="24">
            <el-form :model="edit" :rules="formRules" ref="editForm">
              <el-form-item label="资讯标题" prop="hotInfoTitle">
                <el-input
                  v-model="edit.hotInfoTitle"
                  placeholder="请输入资讯标题"
                  show-word-limit
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="资讯描述" prop="hotInfoTitle">
                <el-input
                  v-model="edit.hotInfoDesc"
                  :autosize="{ minRows: 3, maxRows: 4 }"
                  type="textarea"
                  show-word-limit
                  maxlength="200"
                  placeholder="请输入资讯描述"
                ></el-input>
              </el-form-item>
              <el-form-item label="文章来源" prop="sourceText">
                <el-input
                  v-model="edit.sourceText"
                  show-word-limit
                  maxlength="50"
                  placeholder="请输入文章来源"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="发布时间" prop="releaseTime">
                <el-date-picker
                  v-model="edit.releaseTime"
                  type="date"
                  placeholder="请选择发布时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="资讯封面" prop="imgUrl">
                <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,limit允许上传的最大数量 -->
                <el-upload
                  v-model="edit.imgUrl"
                  :action="uploadImageUrl"
                  list-type="picture-card"
                  :multiple="false"
                  accept=".jpg,.png,.jpeg"
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
                    <div class="el-upload__tip">仅支持jpg/jpeg/png格式图片</div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="资讯内容" prop="hotInfoText">
                <Editor
                  v-model="edit.hotInfoText"
                  v-on:onchangeEditor="onchangeEditor"
                  v-on:editorInit="editorInit"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="6">
            <el-button type="primary" @click="onEdit">保存</el-button>
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
      updateUrl: "hot-info/update",
      getByIdUrl: "hot-info/getById/",
      editImageList: [],
      formRules: formRules, //创建弹窗的验证规则
      edit: {},
      editor: "", //富文本组件
    };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  created() {
    this.getById(this.$route.query.id);
  },
  //   监听需要编辑的值，进行更改富文本组件的初始显示
  watch: {
    edit(val, oldVal) {
      this.editor.txt.html(val.hotInfoText);
    },
  },
  methods: {
    //   返回上一页
    goBack() {
      this.$router.go(-1);
    },
    // 根据id获取编辑数据
    async getById(id) {
      const { data: res } = await this.axios.get(this.getByIdUrl + id);
      if (res.code == 200) {
        this.edit = res.data;
        const imgUrl = res.data.imgUrl.split("/");
        // 显示的图片
        this.editImageList[0] = {
          name: imgUrl[imgUrl.length - 1],
          url: this.httpResource + this.edit.imgUrl,
        };
        delete this.edit.updateTime;
        return;
      }
      this.$message.error("数据请求失败");
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
          this.$message.success("操作成功");
          // 再添加选择的文件
          this.$refs.editUploadImage.handleStart(files[0]);
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
              // 刷新数据
              this.$router.go(-1);
              return;
            }
          }
          this.$message.error("保存数据失败!");
        }
      });
    },
    // 将富文本中的值赋值到表单模型中
    async onchangeEditor(newHtml) {
      this.edit.hotInfoText = newHtml;
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