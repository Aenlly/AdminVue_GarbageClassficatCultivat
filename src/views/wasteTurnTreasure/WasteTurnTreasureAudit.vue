<template>
  <el-tabs v-model="activeName" type="border-card" stretch>
    <el-tab-pane label="待审核库" name="WasteTurnTreasureAuditToAudit"
      ><WasteTurnTreasureAuditToAudit
    /></el-tab-pane>
    <el-tab-pane label="未通过库" name="WasteTurnTreasureAuditNotThrough" lazy>
      <WasteTurnTreasureAuditNotThrough />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import WasteTurnTreasureAuditToAudit from "@/views/wasteTurnTreasure/WasteTurnTreasureAuditToAudit";
import WasteTurnTreasureAuditNotThrough from "@/views/wasteTurnTreasure/WasteTurnTreasureAuditNotThrough";
export default {
  components: {
    WasteTurnTreasureAuditToAudit,
    WasteTurnTreasureAuditNotThrough,
  },
  data() {
    return {
      activeName: "WasteTurnTreasureAuditToAudit",
    };
  },
};
</script>

<style>
</style>