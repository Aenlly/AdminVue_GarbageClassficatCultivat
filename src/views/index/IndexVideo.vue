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
                  <el-option label="视频标题" value="0"></el-option>
                  <el-option label="视频简介" value="1"></el-option>
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
                prop="videoTitle"
                label="标题"
                show-overflow-tooltip
              />
              <el-table-column
                prop="videoDesc"
                label="描述"
                show-overflow-tooltip
              />
              <el-table-column label="封面" width="150">
                <template #default="{ row }">
                  <el-tooltip content="单击预览" placement="bottom">
                    <el-image
                      :src="httpResource + row.videoImg"
                      style="height: 80px"
                      :preview-src-list="[httpResource + row.videoImg]"
                      fit="contain"
                    ></el-image>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="shareCount" label="分享数" />
              <el-table-column prop="videoCheck" label="状态" width="80" />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" fixed="right" width="350">
                <template #default="{ row }">
                  <el-tooltip content="置顶内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-top"
                      size="small"
                      @click="top(row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="发布内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      size="small"
                      @click="publish(row)"
                    ></el-button>
                  </el-tooltip>

                  <el-tooltip content="下架内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-remove-outline"
                      size="small"
                      @click="shelf(row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="查看视频" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-view"
                      size="small"
                      @click="checkVideo(row.videoUrl)"
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

                  <el-tooltip content="删除数据" placement="bottom">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="deleteById(row.videoId)"
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

  <!-- 创建数据弹窗开始 -->
  <el-dialog v-model="dialogCreateVisible" title="新增数据" top="5vh">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form :model="create" ref="createForm" :rules="formRules">
          <el-form-item label="标题" prop="videoTitle">
            <el-input
              v-model="create.videoTitle"
              placeholder="请输入标题"
              show-word-limit
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="videoDesc">
            <el-input
              v-model="create.videoDesc"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="videoImg">
            <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,accept限制上传格式,limit允许上传的最大数量,name上传的文件字段名 -->
            <el-upload
              v-model="create.videoImg"
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
          <el-form-item label="视频" prop="videoUrl">
            <el-upload
              v-model="create.videoUrl"
              drag
              accept=".mp4"
              name="videoFile"
              ref="createUploadVideo"
              :action="uploadVideoUrl"
              :multiple="false"
              :limit="1"
              :on-success="createSuccessVideo"
              :on-error="createErrorVideo"
              :on-exceed="createExceedVideo"
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
          <el-form-item label="状态" prop="videoCheck">
            <el-select v-model="create.videoCheck" placeholder="请选择状态">
              <el-option
                v-for="item in videoChecks"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
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
  <!-- 创建数据弹窗结束 -->

  <!-- 编辑弹窗开始 -->
  <el-dialog v-model="dialogEditVisible" title="编辑数据" top="5vh">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form :model="edit" :rules="formRules" ref="editForm">
          <el-form-item label="标题" prop="videoTitle">
            <el-input
              v-model="edit.videoTitle"
              placeholder="请输入标题"
              show-word-limit
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="videoDesc">
            <el-input
              v-model="edit.videoDesc"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              show-word-limit
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="videoImg">
            <!-- action上传的地址,list-type改变样式,multiple是否支持多选文件,limit允许上传的最大数量 -->
            <el-upload
              v-model="edit.videoImg"
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
                    alt=""
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
          <el-form-item label="状态" prop="videoCheck">
            <el-select v-model="edit.videoCheck" placeholder="请选择状态">
              <el-option
                v-for="item in videoChecks"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 编辑弹窗底部区域 -->
    <template #footer>
      <span>
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="onEdit">保存</el-button>
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
  videoTitle: [
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
  videoDesc: [
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
  videoUrl: [
    {
      required: true, //必填
      message: "请上传视频", //提示
      trigger: "blur", //鼠标离开时触发
    },
  ],
  videoImg: [
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
      breadcrumb: [{ name: "首页信息管理" }, { name: "视频信息管理" }],
      httpResource: this.$httpResource,
      uploadVideoUrl: this.axios.defaults.baseURL + "video/uploadVideo", //上传视频文件地址
      uploadImageUrl: this.axios.defaults.baseURL + "video/uploadImage", //上传图片文件地址
      getListUrl: "/video/getList", //获取的数据的后台接口
      delByIdsUrl: "/video/delByIds", //批量删除的后台接口
      delByIdUrl: "/video/delById", //单一删除数据的后台接口
      createUrl: "video/create", //新增数据的后台接口
      updateUrl: "video/update", //修改数据的后台接口
      editVideoList: [],
      editImageList: [],
      videoChecks: [
        {
          name: "待发布",
          value: 0,
        },
        {
          name: "已发布",
          value: 1,
        },
        {
          name: "已下线",
          value: -1,
        },
        {
          name: "置顶",
          value: 2,
        },
      ],
      queryType: "0", //查询类型
      text: "", //查询内容
      checkVideoUrl: "", //查看的视频url地址
      dialogCheckVisible: false, //查看视频的对话框
      dialogCreateVisible: false, //创建数据的对话框
      dialogEditVisible: false, //编辑数据的对话框
      selectIds: [],
      edit: {},
      create: {
        videoTitle: "",
        videoDesc: "",
        videoImg: "",
        videoUrl: "",
        videoCheck: "待发布",
      },
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
    this.getTableList(this.data.current, this.data.size);
  },

  methods: {
    // 根据条件查询数据
    queryBy() {
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
    // 选择时触发事件
    handleSelectionChange(val) {
      // 统计所选id
      this.selectIds = val.map((item) => item.videoId);
    },
    // pageSize每页数据量大小 改变时触发
    handleSizeChange(size) {
      this.size = size;
    },
    // current-change，单击页码时 改变时触发
    handleCurrentChange(current) {
      this.current = current;
      this.queryBy();
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
    // 置顶按钮触发事件
    top(row) {
      if (row.videoCheck === "置顶") {
        this.$message.warning("该数据已是置顶状态!");
      } else {
        this.updateCheck("/top", row.videoId, "置顶成功");
      }
    },
    // 发布按钮触发事件
    publish(row) {
      if (row.videoCheck === "已发布") {
        this.$message.warning("该数据已是发布状态!");
      } else {
        this.updateCheck("/publish", row.videoId, "发布成功");
      }
    },
    // 下线按钮触发事件
    shelf(row) {
      if (row.videoCheck === "已下线") {
        this.$message.warning("该数据已是下线状态!");
      } else {
        this.updateCheck("/shelf", row.videoId, "下线成功");
      }
    },
    // 更改状态方法
    async updateCheck(url, id, msg) {
      const { data: res } = await this.axios.put("/video" + url + "/" + id);
      if ((res.code = 200)) {
        this.$message.success(msg);
        this.queryBy();
      } else {
        this.$message.error("设置失败!");
      }
    },
    // 编辑按钮触发事件
    editById(row) {
      // 深拷贝，使其不改变表格中的内容
      this.edit = qs.parse(qs.stringify(row));
      // 在字段中删除创建时间与分享量
      delete this.edit.createTime;
      delete this.edit.shareCount;
      const videoImg = row.videoImg.split("/");
      const videoUrl = row.videoUrl.split("/");
      // 显示的图片
      this.editImageList[0] = {
        name: videoImg[videoImg.length - 1],
        url: this.httpResource + row.videoImg,
      };
      // 显示的视频文件
      this.editVideoList[0] = {
        name: videoUrl[videoUrl.length - 1].slice(-10),
        url: this.httpResource + row.videoUrl,
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
        this.create.videoImg = response.data;
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

    // 新增数据弹窗上传视频文件成功触发事件
    createSuccessVideo(response, file, fileList) {
      if (response.code == 200) {
        file.url = this.httpResource + response.data;
        this.create.videoUrl = response.data;
        this.$message.success("上传视频成功");
      } else {
        this.$message.error("上传视频失败");
      }
    },
    // 新增数据弹窗上传视频文件失败触发事件
    createErrorVideo(err, file, fileList) {
      if (file.size > 1024 * 1024 * 500) {
        this.$message.error("视频超出500MB大小");
      } else {
        this.$message.error("上传视频失败,请检查文件是否符合标准");
      }
    },
    // 新增数据弹窗中上传视频文件超出数量限制时触发事件
    createExceedVideo(files, fileList) {
      this.$messageBox
        .confirm("确定覆盖前一个文件?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.create.videoUrl = null;
          // 先清除原来的文件
          this.$refs.createUploadVideo.handleRemove(fileList[0]);
          // 再添加选择的文件
          this.$refs.createUploadVideo.handleStart(files[0]);
          this.$message.success("操作成功");
          // 进行上传
          this.$refs.createUploadVideo.submit();
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
            if (res.data == true) {
              this.dialogCreateVisible = false;
              // 重置表单与清除上传的文件
              this.$refs.createForm.resetFields();
              this.$refs.createUploadImage.clearFiles();
              this.$refs.createUploadVideo.clearFiles();
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
        this.edit.videoImg = response.data;
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
          this.edit.videoImg = null;
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
  },
};
</script>

<style lang="less" scoped>
</style>