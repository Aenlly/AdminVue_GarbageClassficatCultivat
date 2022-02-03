<template>
  <el-row>
    <el-col :span="24">
      <div ref="editor"></div>
    </el-col>
  </el-row>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, toRefs, watch } from "vue";
import WangEditor from "wangeditor";
export default {
  props: {
    html: String,
    onchangeEditor: {
      type: Function,
      default: null,
    },
    editorInit: {
      type: Function,
      default: null,
    },
  },
  setup(props, content) {
    var { html } = toRefs(props);
    const editor = ref();
    let instance;
    onMounted(() => {
      instance = new WangEditor(editor.value);
      Object.assign(instance.config, {
        onchange: function (newHtml) {
          content.emit("onchangeEditor", newHtml);
        },
      });
      instance.create();
      content.emit("editorInit", instance);
    });
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