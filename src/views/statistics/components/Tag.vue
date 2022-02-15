<template>
  <el-row
    :style="
      'background-color:' + color + ';border-radius: 10px; padding: 10px;'
    "
  >
    <el-col :span="24">
      <el-space direction="vertical">
        <p>
          <span class="title_span"> {{ title }} </span>
        </p>
        <p>
          <span class="number_span">{{ number }}</span>
        </p>
      </el-space>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    color: String,
    title: String,
    number: String,
  },
};
</script>

<style lang="less" scoped>
// 新增用户数量文本样式
.title_span {
  font-size: 16px;
  color: #ffffff;
  line-height: 22px;
  font-family: OPPOSans, OPPOSans-Medium;
}
//新增用户数量数据样式
.number_span {
  font-size: 24px;
  color: #ffffff;
}
</style>