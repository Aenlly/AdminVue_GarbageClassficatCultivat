<template>
  <el-tabs v-model="activeName" type="border-card" stretch>
    <el-tab-pane label="信息管理(用户)" name="WasteTurnTreasureUser"
      ><WasteTurnTreasureUser
    /></el-tab-pane>
    <el-tab-pane label="信息管理(管理员)" name="WasteTurnTreasureAdmin" lazy>
      <WasteTurnTreasureAdmin />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import WasteTurnTreasureUser from "@/views/wasteTurnTreasure/WasteTurnTreasureUser";
import WasteTurnTreasureAdmin from "@/views/wasteTurnTreasure/WasteTurnTreasureAdmin";
export default {
  components: { WasteTurnTreasureUser, WasteTurnTreasureAdmin },
  data() {
    return {
      activeName: "WasteTurnTreasureUser",
    };
  },
};
</script>

<style>
</style>