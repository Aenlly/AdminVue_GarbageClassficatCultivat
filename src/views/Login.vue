<template>
  <el-main>
    <el-row class="login-container" align="middle">
      <el-col :span="6" :offset="9">
        <div class="login_box">
          <!-- 登录表单开始，ref代表表单的引用对象 -->
          <el-form ref="formRef" :model="form" :rules="loginRules">
            <el-form-item>
              <span class="long_title"> 登&nbsp;&nbsp;录 </span>
            </el-form-item>
            <el-form-item prop="username">
              <el-input placeholder="请输入手机号/邮箱" v-model="form.username">
                <template #prefix>
                  <el-icon class="el-input__icon" color="#9b9b9b"
                    ><user-filled
                  /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                placeholder="请输入密码"
                v-model="form.password"
              >
                <template #prefix>
                  <el-icon class="el-input__icon" color="#9b9b9b">
                    <key />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn_Login" type="primary" @click="login">
                登&nbsp;&nbsp;录
              </el-button>
            </el-form-item>
          </el-form>
          <!-- 登录表单结束 -->
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import qs from "qs";

//验证规则
const loginRules = {
  username: [
    {
      required: true, //必填
      message: "请输入账号", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 5, //最小长度
      max: 20, //最大长度
      message: "长度在 5 至 20 个字符", //提示
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true, //必填
      message: "请输入密码", //提示
      trigger: "blur", //鼠标离开时触发
    },
    {
      min: 8, //最小长度
      max: 16, //最大长度
      message: "长度在 8 至 16 个字符", //提示
      trigger: "blur",
    },
  ],
};

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      loginRules: loginRules,
    };
  },
  methods: {
    login() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("账号或密码错误!");
          return;
        }
        const { data: res } = await this.axios.post(
          "login",
          qs.stringify(this.form)
        );
        //判断请求返回值
        if ((res.code = 500)) {
          this.$message({
            duration: 2000,
            message: "登录失败，请检查账号和密码!",
            type: "error",
          });
        } else {
          //提示
          this.$message.success("登录成功");
          //存储token
          window.sessionStorage.setItem("token", res.data.token);
          console.log(res.data);
          window.sessionStorage.setItem("id", res.data.id);
          window.sessionStorage.setItem("name", res.data.name);
          window.sessionStorage.setItem("imgUrl", res.data.imgUrl);

          //跳转页面
          this.$router.push("/index");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-main {
  --el-main-padding: 0;
  height: 100%;
}
.login-container {
  height: 100%;
  background-color: rgb(21, 58, 139);
}
.login_box {
  border: 1px solid #4a90e2;
  padding: 10% 20% 10% 20%;
  border-radius: 20px;
  background-color: rgb(51, 80, 150);
}
.long_title {
  font-size: 2em;
  color: #fff;
}
.btn_Login {
  width: 100%;
}
</style>
