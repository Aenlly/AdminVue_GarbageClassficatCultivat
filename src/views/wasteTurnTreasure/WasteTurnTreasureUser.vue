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
                  <el-option label="标题" value="0"></el-option>
                  <el-option label="描述" value="1"></el-option>
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
          <el-col :span="3">
            <el-select v-model="textTag" style="width: 150px">
              <template #prefix> 标签：</template>
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in textTagList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2"> </el-col>
        </el-row>
        <!-- 数据区域容器结束 -->
        <!-- 数据表格容器开始,selection-change当选择项发生变化时会触发该事件 -->
        <el-row>
          <el-col :span="24">
            <el-table
              :data="data.records"
              style="width: 100%"
              max-height="550"
              border
              stripe
            >
              <el-table-column fixed type="index" label="序号" width="60" />
              <el-table-column prop="text" label="标题" show-overflow-tooltip />
              <el-table-column
                prop="textDesc"
                label="描述"
                show-overflow-tooltip
              />
              <el-table-column label="封面" width="150">
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
              <el-table-column prop="likeCount" label="点赞量" />
              <el-table-column prop="collectCount" label="收藏量" />
              <el-table-column prop="shareCount" label="分享量" />
              <el-table-column label="标签" width="70">
                <template #default="{ row }">
                  <el-tag>{{ row.textTag }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="80">
                <template #default="{ row }">
                  <el-tag type="success">{{ row.audit }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" fixed="right" width="180">
                <template #default="{ row }">
                  <el-tooltip content="查看视频" placement="bottom">
                    <el-button
                      icon="el-icon-view"
                      size="small"
                      @click="checkVideo(row.videoUrl)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="发布内容" placement="bottom">
                    <el-button
                      type="success"
                      icon="el-icon-circle-plus-outline"
                      size="small"
                      @click="publish(row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="下架内容" placement="bottom">
                    <el-button
                      type="danger"
                      icon="el-icon-remove-outline"
                      size="small"
                      @click="shelf(row)"
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
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";

export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      breadcrumb: [
        { name: "变废为宝管理" },
        { name: "信息管理" },
        { name: "信息管理(用户)" },
      ],
      httpResource: this.$httpResource,
      getListUrl: "waste-turn-treasure/getList", //获取数据的后台接口
      queryType: "0", //查询类型
      text: "", //查询内容
      textTag: "", //标签条件
      isUserUpload: "是", //是否用户上传的信息
      checkVideoUrl: "", //查看的视频url地址
      dialogCheckVisible: false, //查看视频的对话框
      textTagList: ["好用", "好看", "好玩"],
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
  // 监听变化的值
  watch: {
    //   监听标签状态选项框，使其变动时，重新赋值
    textTag(val, oldVal) {
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
          textTag: this.textTag,
          isUserUpload: this.isUserUpload,
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
    },
    // 查看视频弹窗关闭事件
    dialogCheckClose() {
      this.checkVideoUrl = null;
    },
    // 发布按钮触发事件
    publish(row) {
      if (row.audit === "已发布") {
        this.$message.warning("该数据已是发布状态!");
      } else {
        this.updateRevise("/publish", row.id, "发布成功");
      }
    },
    // 下线按钮触发事件
    shelf(row) {
      if (row.audit === "已下架") {
        this.$message.warning("该数据已是下架状态!");
      } else {
        this.updateRevise("/shelf", row.id, "下线成功");
      }
    },

    // 更改状态方法
    async updateRevise(url, id, msg) {
      const { data: res } = await this.axios.put(
        "/waste-turn-treasure" + url + "/" + id
      );
      if ((res.code = 200)) {
        this.$message.success(msg);
        this.queryBy();
      } else {
        this.$message.error("设置失败!");
      }
    },
  },
};
</script>

<style>
</style>