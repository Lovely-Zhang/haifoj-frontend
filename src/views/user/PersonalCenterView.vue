<template>
  <div id="userLoginView">
    <h2 style="margin-bottom: 36px">个人中心</h2>
    <a-form
      :model="form"
      @submit="handleSubmit"
      style="max-width: 360px; margin: 0 auto"
      label-align="left"
      auto-label-width
    >
      <a-form-item field="userAvatar" label="头像">
        <a-image
          v-model="form.userAvatar"
          src="https://www.splitshire.com/wp-content/uploads/2021/10/SplitShire-21-4398.jpg"
          title="图片名称"
          description="图片说明：我的头像"
          width="260"
          footer-position="outer"
          :preview-visible="visible2"
          @preview-visible-change="
            () => {
              visible2 = false;
            }
          "
        >
          <template #extra>
            <div class="actions actions-outer">
              <span
                class="action"
                @click="
                  () => {
                    visible2 = true;
                  }
                "
                ><icon-eye
              /></span>
              <span class="action" @click="onDownLoad"><icon-download /></span>
              <a-tooltip content="关于图片">
                <span class="action"><icon-info-circle /></span>
              </a-tooltip>
            </div>
          </template>
        </a-image>
      </a-form-item>
      <a-form-item field="userAccount" label="昵称">
        <a-input v-model="form.userName" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item field="userPassword" label="个人简介">
        <a-textarea v-model="form.userProfile" placeholder="大家好..." />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="primary" style="width: 120px"
          >更新个人信息
        </a-button>
        <a-button
          type="primary"
          html-type="primary"
          style="width: 120px; margin-left: 60px"
          @click="router.push('/')"
          >返回</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { UserControllerService, UserUpdateMyRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { ref } from "vue";
import {
  IconEye,
  IconDownload,
  IconInfoCircle,
} from "@arco-design/web-vue/es/icon";
import { useStore } from "vuex";

const visible1 = ref(false);
const visible2 = ref(false);

const onDownLoad = () => {
  alert("download");
  console.log("download");
};

const router = useRouter();
const store = useStore();
const userLogin = store.state.user?.loginUser;

/**
 * 表单信息
 */
const form = reactive({
  userAvatar: userLogin.userAvatar,
  userName: userLogin.userName,
  userProfile: userLogin.userProfile,
} as UserUpdateMyRequest);

// computed(() => {
//   const userLogin = store.state.user?.loginUser;
//   if (userLogin?.userName !== null) {
//     return userLogin?.userName;
//   }
//   return "未登录";
// });

/**
 * 提交表单，执行登录
 */
const handleSubmit = async (v: string) => {
  console.log(v);
  const res = await UserControllerService.updateMyUserUsingPost(form);
  // 注册成功则跳转到主页，获取个人信息
  if (res.code === 0) {
    message.success("更新成功");
  } else {
    message.error("注册失败，原因：" + res.message);
  }
};
</script>
<style scoped>
.actions {
  display: flex;
  align-items: center;
}

.action {
  padding: 5px 4px;
  font-size: 14px;
  margin-left: 12px;
  border-radius: 2px;
  line-height: 1;
  cursor: pointer;
}

.action:first-child {
  margin-left: 0;
}

.action:hover {
  background: rgba(0, 0, 0, 0.5);
}

.actions-outer {
  .action {
    & :hover {
      color: #ffffff;
    }
  }
}
</style>
