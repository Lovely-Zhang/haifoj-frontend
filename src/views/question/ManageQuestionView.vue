<template>
  <div id="manageQuestionView">
    <h2 style="margin: 10px 10px 20px 20px">管理题目</h2>
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
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)">修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from "vue";
import {
  DeleteRequest,
  QuestionControllerService,
  QuestionQueryRequest,
  QuestionUpdateRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();

const total = ref(0);
const dataList = ref([]);
const searchParams = reactive({
  current: 1,
  pageSize: 10,
} as QuestionQueryRequest);

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
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
// watchEffect(() => {
//   loadData();
// });
const onPageChange = (current: number) => {
  searchParams.current = current;
  loadData();
};

const doDelete = async (deleteQuestion: DeleteRequest) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost(
    deleteQuestion
  );
  if (res.code === 0) {
    message.success("删除成功");
    await loadData();
  } else {
    message.error("删除失败" + res.message);
  }
};

const doUpdate = (questionUpdate: QuestionUpdateRequest) => {
  router.push({
    path: "/question/update",
    query: {
      id: questionUpdate.id,
    },
  });
  console.log(questionUpdate);
};

/**
 * 页面加载时请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "答案",
    dataIndex: "answer",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  // {
  //   title: "通过数",
  //   dataIndex: "acceptedNum",
  // },
  // {
  //   title: "点赞数",
  //   dataIndex: "thumbNum",
  // },
  // {
  //   title: "收藏数",
  //   dataIndex: "favourNum",
  // },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
  },
  {
    title: "用户id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
#manageQuestionView {
}
</style>
