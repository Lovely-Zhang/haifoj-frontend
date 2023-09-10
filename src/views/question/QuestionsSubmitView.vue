<template>
  <div id="questionsSubmitView">
    <h2 class="tableTitle">浏览题目提交列表</h2>
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题目题号"
        />
      </a-form-item>
      <a-form-item field="language" label="编程语言">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
          allow-clear
          default-active-first-option
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #message="{ record }">
        {{ record.judgeInfo.message }}
      </template>
      <template #memory="{ record }">
        {{ record.judgeInfo.memory }}
      </template>
      <template #time="{ record }">
        {{ record.judgeInfo.time }}
      </template>
      <template #userName="{ record }">
        {{ record.userVO.userName }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("yyyy-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();

const total = ref(0);
const dataList = ref([]);
const searchParams = reactive({
  current: 1,
  pageSize: 10,
  questionId: undefined,
  language: undefined,
  sortField: "createTime",
  sortOrder: "descend",
} as QuestionQueryRequest);

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    searchParams
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});
const onPageChange = (current: number) => {
  searchParams.current = current;
  loadData();
};

/**
 * 页面加载时请求数据
 */
onMounted(() => {
  loadData();
});

/**
 * 确认搜索，重新加载数据
 */
const doSearch = () => {
  searchParams.current = 1;
  loadData();
};
const columns = [
  {
    title: "题号",
    dataIndex: "questionId",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "执行信息",
    slotName: "message",
  },
  {
    title: "消耗内存",
    slotName: "memory",
  },
  {
    title: "消耗时间",
    slotName: "time",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "用户昵称",
    slotName: "userName",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];
</script>

<style scoped>
#questionsSubmitView {
  width: 1280px;
  margin: 0 auto;
}

#questionsSubmitView .tableTitle {
  margin: 10px 10px 20px 0px;
}
</style>
