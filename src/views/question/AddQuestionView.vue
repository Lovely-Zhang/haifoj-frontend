<template>
  <div id="addQuestionView">
    <h2 class="label" v-if="!updatePage">创建题目</h2>
    <h2 class="label" v-else>修改题目</h2>
  </div>
  <a-form :model="form" @submit="handleSubmit" label-align="left">
    <a-form-item field="title" label="题目标题">
      <a-input v-model="form.title" placeholder="请输入标题..." class="label" />
    </a-form-item>
    <a-form-item field="tags" label="题目标签">
      <a-input-tag
        v-model="form.tags"
        class="label"
        placeholder="请输入标签"
        allow-clear
      />
    </a-form-item>
    <a-form-item field="content" label="题目内容">
      <MdEditor
        :value="form.content"
        :handle-change="onContentChang"
        class="label"
      />
    </a-form-item>
    <a-form-item field="answer" label="题目答案">
      <CodeEditor
        :value="form.answer"
        :handle-change="onAnswerChang"
        class="label"
      />
    </a-form-item>
    <a-form-item field="judgeConfig" label="判题配置">
      <a-form-item field="judgeConfig.timeLimit" label="时间限制">
        <a-input-number
          style="width: 150px"
          v-model="form.judgeConfig.timeLimit"
          placeholder="时间限制"
          mode="button"
          min="0"
        />
      </a-form-item>
      <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
        <a-input-number
          style="width: 150px"
          v-model="form.judgeConfig.memoryLimit"
          placeholder="内存限制"
          mode="button"
          min="0"
        />
      </a-form-item>
      <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
        <a-input-number
          style="width: 150px"
          v-model="form.judgeConfig.stackLimit"
          placeholder="堆栈限制"
          mode="button"
          min="0"
        />
      </a-form-item>
    </a-form-item>
    <a-form-item field="judgeCase" label="判题用例" class="label">
      <a-space direction="vertical">
        <a-form-item
          v-for="(judgeCaseItem, index) in form.judgeCase"
          :key="index"
          class="label"
          no-style
        >
          <a-space
            direction="vertical"
            style="min-width: 480px; margin-top: 20px"
          >
            <a-form-item
              :field="judgeCaseItem.input"
              :label="`输入用例-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入输入用例..."
              />
            </a-form-item>
            <a-form-item
              :field="judgeCaseItem.output"
              :label="`输出用例-${index}`"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入输出用例..."
              />
            </a-form-item>
            <div>
              <a-button
                @click="handleAdd"
                :style="{ marginLeft: '300px', marginRight: '20px' }"
                status="success"
                >添加用例</a-button
              >
              <a-button
                @click="handleDelete(index)"
                :style="{ marginLeft: '10px' }"
                status="danger"
                >删除用例</a-button
              >
            </div>
          </a-space>
        </a-form-item>
      </a-space>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const form = ref({
  content: "",
  answer: "",
  title: "",
  tags: [],
  judgeConfig: {
    memoryLimit: 500,
    stackLimit: 500,
    timeLimit: 500,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

const onContentChang = (v: string) => {
  form.value.content = v;
};

const onAnswerChang = (v: string) => {
  form.value.answer = v;
};

const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

const handleDelete = (index: number) => {
  if (form.value.judgeCase.length === 1) {
    message.error("删除失败，原因：最后一个");
  } else {
    form.value.judgeCase.splice(index, 1);
  }
};

// 如果页面地址包含 update，则视为更新页面
const updatePage = route.path.includes("update");

/**
 * 页面初始化（如果为修改页）
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 500,
        stackLimit: 500,
        timeLimit: 500,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  if (updatePage) {
    loadData();
    onAnswerChang(form.value.answer);
  }
});

/**
 * 如果路由包含 update 则就是更新，否则就是添加
 */
const handleSubmit = async () => {
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    // 创建成功则跳转到主页，获取个人信息
    if (res.code === 0) {
      message.success("更新成功");
      await router.push({
        path: "/",
        // 用户在导航后后退
        replace: true,
      });
    } else {
      message.error("更新失败，原因：" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    // 创建成功则跳转到主页，获取个人信息
    if (res.code === 0) {
      message.success("创建成功");
      await router.push({
        path: "/",
        replace: true,
      });
    } else {
      message.error("创建失败，原因：" + res.message);
    }
  }
};
</script>

<style scoped>
#addQuestionView {
}
.label {
  width: 900px;
}
</style>
