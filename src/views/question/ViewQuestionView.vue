<template>
  <div id="questionsView">
    <h2 class="tableTitle">在线做题</h2>
    <a-row :gutter="[24, 24]">
      <a-col :md="12" xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}</a-tag
                  >
                </a-space>
              </template>
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制:"
                  >{{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制:"
                  >{{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制:"
                  >{{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer class="mdViewer" :value="question.content || ''" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled> 评论 </a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 暂时无法查看答案 </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item field="language" label="编程语言">
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
              default-active-first-option
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          class="code"
          :value="form.code as string"
          :language="form.language as string"
          :handle-change="doChange"
        />
        <a-button
          type="primary"
          style="width: 150px; margin-top: 10px"
          @click="doSubmit"
          >提交代码</a-button
        >
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, defineProps, onMounted, reactive } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

const question = ref<QuestionVO>();

// 定义参数属性
interface Props {
  id: number;
}

/**
 * 给组件指定初始值
 * withDefaults 如果父组件（Props）没有传给定默认值，defineProps 定义类型
 */
const props = withDefaults(defineProps<Props>(), {
  id: () => -1,
});

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as number
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = reactive({
  code: "",
  language: "java",
} as QuestionSubmitAddRequest);

const doSubmit = async () => {
  if (!form.language) {
    message.info("请选择编程语言");
    return;
  }
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    message.success("提交成功，等待判题");
  } else {
    message.error("提交失败，", res.message);
  }
};

const doChange = (v: string) => {
  form.code = v;
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
#questionsView {
  width: 1280px;
  margin: 0 auto;
}
#questionsView .tableTitle {
  margin: 10px 10px 20px 0;
}
#questionsView .code {
  margin-top: 7px;
  height: 60vh;
}
#questionsView .mdViewer {
  margin-top: 7px;
  height: auto;
}
</style>
