<template>
  <Editor
    :value="value"
    :mode="mode"
    :plugins="plugins"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Editor } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";

// 添加插件
const plugins = [gfm(), highlight()];

/**
 * 定义组件属性
 */
interface Props {
  value: string;
  mode: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定初始值
 * withDefaults 如果父组件（Props）没有传给定默认值，defineProps 定义类型
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "split",
  handleChange: (v: string) => console.log(v),
});
</script>
<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
