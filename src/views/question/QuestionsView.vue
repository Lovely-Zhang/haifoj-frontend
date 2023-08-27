<template>
  <div id="questionsView">
    <h2 class="tableTitle">浏览题目</h2>
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="题目" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入题目名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签内容" />
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
            v-for="(tag, index) of record.tags"
            :key="index"
            color="green"
            >{{ tag }}</a-tag
          >
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            (record.submitNum ? record.acceptedNum / record.submitNum : "0") *
            100
          }%(${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("yyyy-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doQuestionPage(record.id)"
            >开始做题</a-button
          >
        </a-space>
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
  pageSize: 5,
  tags: [],
  title: "",
} as QuestionQueryRequest);

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
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

const doQuestionPage = (id: number) => {
  router.push({
    path: `/view/question/${id}`,
  });
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
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "点赞数",
    dataIndex: "thumbNum",
  },
  {
    title: "收藏数",
    dataIndex: "favourNum",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
#questionsView {
  width: 1280px;
  margin: 0 auto;
}
#questionsView .tableTitle {
  margin: 10px 10px 20px 0px;
}
</style>
