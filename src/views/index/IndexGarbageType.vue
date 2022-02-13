<template>
  <Breadcrumb :infoTitles="breadcrumb" />
  <el-row>
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6"> </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="2"> </el-col>
          <el-col :span="2"> </el-col>
        </el-row>
        <!-- 数据区域容器结束 -->
        <!-- 数据表格容器开始,selection-change当选择项发生变化时会触发该事件 -->
        <el-row>
          <el-col :span="24">
            <el-table
              :data="data.records"
              style="width: 100%"
              max-height="620"
              border
              stripe
            >
              <el-table-column label="垃圾类型" width="100">
                <template #default="scope">
                  <el-popover effect="light" trigger="hover" placement="top">
                    <template #default>
                      <p>中文名: {{ scope.row.nameCn }}</p>
                      <p>英文名: {{ scope.row.nameEn }}</p>
                    </template>
                    <template #reference>
                      <div class="name-wrapper">
                        <el-tag>{{ scope.row.garbageType }}</el-tag>
                      </div>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="textTitle"
                label="标题"
                show-overflow-tooltip
              />
              <el-table-column
                prop="textDesc"
                label="描述"
                show-overflow-tooltip
              />
              <el-table-column
                label="图标"
                class-name="tableImageUrl"
                width="55px"
              >
                <template #default="{ row }">
                  <el-image
                    :src="httpResource + row.imgUrl"
                    :style="'background-color:' + row.bgColor + ';height:35px'"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column label="视频" width="80">
                <template #default="{ row }">
                  <el-tooltip content="查看视频" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-view"
                      size="small"
                      @click="checkVideo(row.videoUrl)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="120">
                <template #default="{ row }">
                  <el-tooltip content="查看所属垃圾类型数据" placement="bottom">
                    <el-button
                      icon="el-icon-s-unfold"
                      size="small"
                      @click="goBelongList(row.garbageType, row.garbageId)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑数据" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="small"
                      @click="editById(row)"
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

  <!-- 视频播放弹窗开始 -->
  <el-dialog
    title="查看视频"
    v-model="dialogCheckVisible"
    width="30%"
    @close="dialogCheckClose"
  >
    <el-row style="width: 100%">
      <el-col :span="24" style="width: 100%">
        <video style="width: 100%" height="300" :src="checkVideoUrl" controls>
          您的浏览器不支持视频播放
        </video>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- 视频播放弹窗结束 -->

  <!-- 编辑弹窗开始 -->
  <el-dialog v-model="dialogEditVisible" title="编辑数据" top="5vh">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form
          :model="edit"
          :rules="formRules"
          ref="editForm"
          label-position="right"
          label-width="70px"
        >
          <el-form-item label="中文名" prop="videoTitle">
            <el-input
              v-model="edit.nameCn"
              placeholder="请输入垃圾类型中文名"
              show-word-limit
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="英文名" prop="videoTitle">
            <el-input
              v-model="edit.nameEn"
              placeholder="请输入垃圾类型英文名"
              show-word-limit
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="textTitle">
            <el-input
              v-model="edit.textTitle"
              placeholder="请输入垃圾类型标题"
              show-word-limit
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="textDesc">
            <el-input
              v-model="edit.textDesc"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入垃圾类型描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="imgUrl">
            <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,limit允许上传的最大数量 -->
            <el-upload
              v-model="edit.imgUrl"
              :action="uploadImageUrl"
              list-type="picture-card"
              :multiple="false"
              accept=".png,.ico"
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
                  仅支持png/ico格式图片,建议72*72像素
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="视频" prop="videoUrl">
            <el-upload
              v-model="edit.videoUrl"
              drag
              :action="uploadVideoUrl"
              ref="editUploadVideo"
              accept=".mp4"
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
              <div class="el-upload__text">
                拖拽文件到此处或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">大小小于500MB的mp4文件</div>
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
  nameCn: [
    {
      required: true, //必填
      message: "请输入垃圾类型中文名", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 50, //最大长度
      message: "长度在 1 至 50 个字符", //提示
      trigger: "blur",
    },
  ],
  nameEn: [
    {
      required: true, //必填
      message: "请输入垃圾类型英文名", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 50, //最大长度
      message: "长度在 1 至 50 个字符", //提示
      trigger: "blur",
    },
  ],
  textTitle: [
    {
      required: true, //必填
      message: "请输入垃圾类型标题", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 50, //最大长度
      message: "长度在 1 至 50 个字符", //提示
      trigger: "blur",
    },
  ],
  textDesc: [
    {
      required: true, //必填
      message: "请输入垃圾类型描述", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 1, //最小长度
      max: 200, //最大长度
      message: "长度在 1 至 200 个字符", //提示
      trigger: "blur",
    },
  ],
  videoUrl: [
    {
      required: true, //必填
      message: "请上传视频", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
  imgUrl: [
    {
      required: true, //必填
      message: "请上传图标", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
};

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [{ name: "首页信息管理" }, { name: "垃圾类型管理" }],
      httpResource: this.$httpResource,
      uploadVideoUrl: this.axios.defaults.baseURL + "garbage/uploadVideo", //上传视频文件地址
      uploadImageUrl: this.axios.defaults.baseURL + "garbage/uploadImage", //上传图片文件地址
      getListUrl: "/garbage/getList", //获取的数据的后台接口
      updateUrl: "garbage/update", //修改数据的后台接口
      editVideoList: [],
      editImageList: [],
      checkVideoUrl: "", //查看的视频url地址
      dialogCheckVisible: false, //查看视频的对话框
      dialogEditVisible: false, //编辑数据的对话框
      selectIds: [],
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
    // 查看视频弹窗事件
    checkVideo(videoUrl) {
      this.dialogCheckVisible = true;
      this.checkVideoUrl = this.httpResource + videoUrl;
      console.log(this.checkVideoUrl);
    },
    // 查看视频弹窗关闭事件
    dialogCheckClose() {
      this.checkVideoUrl = null;
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
      // 编辑弹窗显示的视频
      this.editVideoList[0] = {
        name: videoUrl[videoUrl.length - 1].slice(-10),
        url: this.httpResource + row.videoUrl,
      };
      this.dialogEditVisible = true;
    },

    /**
     * 上传前所需判断的方法 开始
     */
    // 上传前验证图片格式。避免出现格式选择错误
    uploadImage(file) {
      const typeList = ["png", "PNG", "ico", "ICO"];
      // file.type.split分割格式
      if (typeList.indexOf(file.type.split("/")[1]) < 0) {
        this.$message.error("文件格式不符合!");
        return false;
      }
    },
    // 上传前验证视频格式。避免出现格式选择错误
    uploadVideo(file) {
      const typeList = ["mp4", "MP4"];
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

    // 编辑数据弹窗上传视频文件成功触发事件
    editSuccessVideo(response, file, fileList) {
      if (response.code == 200) {
        file.url = this.httpResource + response.data;
        this.edit.videoUrl = response.data;
        this.$message.success("上传视频成功");
      } else {
        this.$message.error("上传视频失败");
      }
    },
    // 编辑数据弹窗上传视频文件失败触发事件
    editErrorVideo(err, file, fileList) {
      if (file.size > 1024 * 1024 * 500) {
        this.$message.error("视频超出500MB大小");
      } else {
        this.$message.error("上传视频失败,请检查文件是否符合标准");
      }
    },
    // 编辑数据弹窗中上传视频文件超出数量限制时触发事件
    editExceedVideo(files, fileList) {
      this.$messageBox
        .confirm("确定覆盖前一个文件?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.edit.videoUrl = null;
          // 先清除原来的文件
          this.$refs.editUploadVideo.handleRemove(fileList[0]);
          // 再添加选择的文件
          this.$refs.editUploadVideo.handleStart(files[0]);
          this.$message.success("操作成功");
          // 进行上传
          this.$refs.editUploadVideo.submit();
        })
        .catch(() => {});
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
    goBelongList(garbageType, garbageId) {
      this.$router.push({
        path: "/indexGarbageList",
        query: {
          garbageTypeName: garbageType,
          belongId: garbageId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>