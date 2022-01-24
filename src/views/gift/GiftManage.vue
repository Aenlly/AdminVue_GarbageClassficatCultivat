<template>
  <el-tabs v-model="activeName" type="border-card" stretch>
    <el-tab-pane label="礼品信息管理" name="GiftInfo"><GiftInfo /></el-tab-pane>
    <el-tab-pane label="礼品类型管理" name="GiftType" lazy
      ><GiftType
    /></el-tab-pane>
  </el-tabs>
</template>

<script>
import GiftInfo from "@/views/gift/GiftInfo";
import GiftType from "@/views/gift/GiftType";
export default {
  components: { GiftInfo, GiftType },
  data() {
    return {
      activeName: "GiftInfo",
    };
  },
};
</script>

<style>
</style>