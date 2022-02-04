<template>
  <el-row style="height: 600px">
    <el-col :span="24">
      <!-- 卡片开始 -->
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-page-header content="热门资讯详情" @back="goBack" />
          </div>
        </template>
        <el-row>
          <el-col :span="24">{{ info.hotInfoTitle }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="24">
            <div v-html="info.hotInfoText"></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      httpResource: this.$httpResource,
      getByIdUrl: "hot-info/getById/",
      info: {},
      editor: "", //富文本组件
    };
  },
  // 在创建实例之后调用的钩子，所以用来初始化数据
  created() {
    this.getById(this.$route.query.id);
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
        this.info = res.data;
        delete this.info.imgUrl;
        delete this.info.updateTime;
        return;
      }
      this.$message.error("数据请求失败");
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
  },
};
</script>

<style>
</style>