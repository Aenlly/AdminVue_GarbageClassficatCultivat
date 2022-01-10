<template>
  <Breadcrumb :infoTitles="breadcrumb" />
  <el-row>
    <el-col :span="24">
      <el-card class="box-card">
        <!-- 数据区域容器开始 -->
        <el-row class="data-header">
          <!-- 搜索区开始 -->
          <el-col :span="6">
            <el-input v-model="searchText" placeholder="请输入搜索条件">
              <template #prepend>
                <el-select
                  v-model="select"
                  placeholder="请选择"
                  style="width: 110px"
                >
                  <el-option label="视频标题" value="1"></el-option>
                  <el-option label="视频简介" value="2"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button>
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <!-- 搜索区结束 -->
          <el-col :span="2">
            <el-button type="primary">上传视频</el-button>
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
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              max-height="620"
              border
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
              <el-table-column prop="videoCheck" label="状态" />
              <el-table-column prop="shareCount" label="分享数" />
              <el-table-column label="操作" fixed="right">
                <template #default="{ row }">
                  <el-tooltip content="发布内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      size="small"
                      @click="release(row.id)"
                    ></el-button>
                  </el-tooltip>

                  <el-tooltip content="下架内容" placement="bottom">
                    <el-button
                      type="primary"
                      icon="el-icon-remove-outline"
                      size="small"
                      @click="shelf(row.id)"
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
        <Pagination />
      </el-card>
    </el-col>
  </el-row>

  <el-dialog v-model="dialogEditVisible" title="编辑数据">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form :model="form">
          <el-form-item label="标题">
            <el-input v-model="videoTitle" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="videoDesc" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="videoCheck" placeholder="请选择状态">
              <el-option :label="待审核" :value="0"></el-option>
              <el-option :label="已发布" :value="1"></el-option>
              <el-option :label="已下线" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <span>
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import Pagination from "../../components/Pagination.vue";
export default {
  components: { Breadcrumb, Pagination },
  data() {
    return {
      dialogEditVisible: false,
      searchText: "",
      select: "",
      selectIds: [],
      breadcrumb: [{ name: "首页信息管理" }, { name: "视频信息管理" }],
      tableData: [
        {
          id: 12,
          videoTitle: "Tom",
          videoDesc:
            "Californi石室诗士施氏，嗜狮，誓食十狮。施氏时时适市视狮。十时，适十狮适市。是时，适施氏适市。施氏视是十狮，恃矢势，使是十狮逝世。氏拾是十狮尸，适石室。石室湿，氏使侍拭石室。石室拭，氏始试食是十狮尸。食时，始识a",
          videoCheck: "Los Angeles",
          shareCount: "No. 189, Grove St, Los Angeles",
        },
      ],
    };
  },
  methods: {
    // 选择时触发事件
    handleSelectionChange(val) {
      // 统计所选id
      this.selectIds = val.map((item) => item.id);
    },
    // 删除所选触发事件
    deleteByIds() {
      if (this.selectIds.length > 0) {
        console.log(this.selectIds);
      } else {
        this.$message.warning("请先选择数据!");
      }
    },
    async release(id) {
      const { data: res } = await this.axios.post("login", { id: id });
    },
    async shelf(id) {
      const { data: res } = await this.axios.post("login", { id: id });
    },
    // 编辑按钮触发事件
    async editById(row) {
      console.log(row);
      this.dialogEditVisible = true;
    },
    // 删除按钮触发事件
    async deleteById(id) {
      console.log(id);
    },
  },
};
</script>

<style>
</style>