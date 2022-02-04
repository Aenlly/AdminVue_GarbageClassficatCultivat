<template>
  <el-tabs v-model="activeName" type="border-card" stretch>
    <el-tab-pane label="题库信息列表" name="QuestionBank"
      ><QuestionBank
    /></el-tab-pane>
    <el-tab-pane label="测验积分排名" name="QuizPoints" lazy>
      <QuizPoints />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import QuestionBank from "@/views/quiz/components/QuestionBank";
import QuizPoints from "@/views/quiz/components/QuizPoints";
export default {
  components: { QuestionBank, QuizPoints },
  data() {
    return {
      activeName: "QuestionBank",
    };
  },
};
</script>

<style>
</style>