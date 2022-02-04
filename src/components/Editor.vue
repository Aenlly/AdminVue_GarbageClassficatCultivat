<template>
  <el-row>
    <el-col :span="24">
      <div ref="editor"></div>
    </el-col>
  </el-row>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from "vue";
import WangEditor from "wangeditor";
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
  },
  setup(props, content) {
    const editor = ref();
    let instance;
    // 页面加载时，相对于初始化
    onMounted(() => {
      // 创建富文本
      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        onchange: function (newHtml) {
          // 调用父方法，进行赋值到表单键值对中
          content.emit("onchangeEditor", newHtml);
        },
      });
      instance.create();
      // 调用父方法给予富文本对象
      content.emit("editorInit", instance);
    });
    // 销毁页面时
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });
    return {
      editor,
    };
  },
};
</script>

<style>
</style>