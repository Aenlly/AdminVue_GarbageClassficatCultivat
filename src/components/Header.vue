<template>
  <el-header>
    <div class="header-image" @click="indexClick">
      <el-image
        :src="require('../assets/logo.png')"
        fit="fill"
        style="height: 100%"
      ></el-image>
      <span class="hidden-xs-only">垃圾分类养成后台管理系统</span>
    </div>
    <div class="hidden-xs-only">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :src="imgUrl" />
        </span>
        <template #dropdown>
          <div class="menu-box">
            <el-dropdown-menu>
              <div class="name-box">
                <span>{{ name }}</span>
              </div>
              <el-divider></el-divider>
              <el-dropdown-item @click="checkDialog">账号信息</el-dropdown-item>
              <el-dropdown-item @click="changePwd"> 修改密码 </el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </template>
      </el-dropdown>
    </div>
  </el-header>

  <el-dialog title="修改密码" v-model="dialogVisible">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form
          :model="admin"
          :rules="formRules"
          ref="adminForm"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="头像地址" prop="imgUrl">
            <el-input
              v-model="admin.imgUrl"
              placeholder="请输入头像地址"
              maxlength="255"
            >
              <template #suffix>
                <el-tooltip placement="right" content="头像预览">
                  <div
                    style="
                      height: 100%;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <el-avatar size="small" :src="admin.imgUrl"></el-avatar>
                  </div>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input
              v-model="admin.name"
              placeholder="请输入昵称"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="tel">
            <el-input
              type="tel"
              v-model="admin.tel"
              placeholder="请输入手机号"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email">
            <el-input
              v-model="admin.email"
              placeholder="请输入邮箱地址"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 修改密码弹窗底部区域 -->
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onEdit">确认</el-button>
      </span>
    </template>
    <!-- 修改密码弹窗底部区域 -->
  </el-dialog>
</template>

<script>
import qs from "qs";

//验证规则
const formRules = {
  imgUrl: [
    {
      required: true, //必填
      message: "请输入头像地址", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 2, //最小长度
      max: 255, //最大长度
      message: "长度在 2 至 255 个字符", //提示
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true, //必填
      message: "请输入昵称", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 2, //最小长度
      max: 20, //最大长度
      message: "长度在 2 至 20 个字符", //提示
      trigger: "blur",
    },
  ],
  tel: [
    {
      required: true, //必填
      message: "请输入手机号", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      pattern:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: "手机号格式不正确",
    },
  ],
  email: [
    {
      required: true, //必填
      message: "请输入邮箱地址", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 5, //最小长度
      max: 30, //最大长度
      message: "长度在 5 至 30 个字符", //提示
      trigger: "blur",
    },
    {
      pattern:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "邮箱格式不正确",
    },
  ],
};

export default {
  name: "Header",
  data() {
    return {
      name: window.sessionStorage.getItem("name"),
      imgUrl: window.sessionStorage.getItem("imgUrl"),
      getByTokenUrl: "admin-table/getByToken", //请求管理员信息的后台接口
      changePwdUrl: "admin-table/changePwd", //修改密码的后台接口
      updateUrl: "admin-table/update", //修改数据的后台接口
      dialogVisible: false,
      formRules: formRules,
      admin: {},
    };
  },
  methods: {
    //跳转首页
    indexClick() {
      this.$router.push("/index");
    },

    // 退出登录
    logout() {
      this.$messageBox
        .confirm("确认退出登录？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning", //警告
        })
        .then(() => {
          // 清空本地信息
          window.sessionStorage.clear();
          this.$message("退出登录成功");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    async checkDialog() {
      const { data: res } = await this.axios.get(this.getByTokenUrl);
      if (res.code == 403) {
        // 清空本地信息
        window.sessionStorage.clear();
        this.$message("登录已过期");
        this.$router.push("/login");
      }
      // 返回码进行判断
      else if (res.code == 200) {
        this.admin = res.data;
        this.dialogVisible = true;
        return;
      }
      this.$message.error("请求管理员信息失败!");
    },
    changePwd() {
      this.$messageBox
        .prompt("请输入新密码", "修改密码", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /[a-zA-Z0-9_.!@#$%^&*()~]{8,16}/,
          inputErrorMessage:
            "请输入新密码,长度在8至16个字符之间,支持符号：_.!@#$%^&*()~",
        })
        .then(async ({ value }) => {
          const info = {
            password: value,
          };
          const { data: res } = await this.axios.put(
            this.changePwdUrl,
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
            this.$message.success("修改密码成功!请重新登录");
            // 清空本地信息
            window.sessionStorage.clear();
            this.$router.push("/login");
            return;
          }
          this.$message.error("修改密码失败!");
        })
        .catch(() => {});
    },
    // 修改数据的执行方法
    onEdit() {
      // 校验表单
      this.$refs.adminForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请填写正确信息!");
          return;
        } else {
          const { data: res } = await this.axios.put(
            this.updateUrl,
            qs.stringify(this.admin)
          );
          if (res.code == 403) {
            // 清空本地信息
            window.sessionStorage.clear();
            this.$message("登录已过期");
            this.$router.push("/login");
          }
          // 返回码进行判断
          else if (res.code == 200) {
            if (res.data === 200) {
              this.$message.success("修改数据成功!");
              window.sessionStorage.setItem("name", this.admin.name);
              window.sessionStorage.setItem("tel", this.admin.tel);
              window.sessionStorage.setItem("email", this.admin.email);
              window.sessionStorage.setItem("imgUrl", this.admin.imgUrl);
              // 关闭弹窗
              this.dialogVisible = false;
              return;
            } else if (res.data == 100) {
              this.$message.error("手机号已存在!");
              return;
            } else if (res.data == 300) {
              this.$message.error("邮箱已存在!");
              return;
            }
          }
          this.$message.error("修改数据失败!");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #1f2d3d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.header-image {
  display: flex;
  align-items: center;
  height: 100%;
  > span {
    font-size: 20px;
    margin-left: 15px;
  }
}
.menu-box {
  padding: 0 20px;
}
.name-box {
  line-height: 36px;
  color: var(--el-text-color-regular);
  outline: 0;
  text-align: center;
  > span {
    font-size: 20px;
  }
}
</style>