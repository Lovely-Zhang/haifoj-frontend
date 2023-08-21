<template>
  <div id="code-editor" ref="codeEditorRef" class="code"></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps } from "vue";

/**
 * 定义组件属性
 */
interface Props {
  value: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定初始值
 * withDefaults 如果父组件（Props）没有传给定默认值，defineProps 定义类型
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  handleChange: (v: string) => console.log(v),
});

const codeEditorRef = ref();
const codeEditor = ref();

// const fillValue = () => {
//   if (!codeEditor.value) {
//     return;
//   }
//   // 改变值
//   toRaw(codeEditor.value).setValue("codeEditor 新的值：");
// };

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value, // 默认显示的值
    theme: "vs-dark",
    language: "java",
    minimap: {
      enabled: true, // 开启小地图
    },
    lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
    readOnly: false, // 是否已读
    automaticLayout: true, // 自动布局
  });
  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>
<style scoped>
.code {
  height: 400px;
  width: auto;
}
</style>
