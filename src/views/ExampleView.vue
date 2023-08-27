<template>
  <div class="exampleView">
    {{ codeValue }}
    <CodeEditor
      :value="codeValue"
      :handle-change="onCodeChange"
      style="height: 300px"
    />
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
  </div>
</template>

<script setup lang="ts">
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { ref } from "vue";

const codeValue = ref();
const mdValue = ref();

const onCodeChange = (v: string) => {
  codeValue.value = v;
};
const onMdChange = (v: string) => {
  mdValue.value = v;
};
</script>
