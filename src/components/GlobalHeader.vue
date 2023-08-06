<template>
  <a-row style="margin-bottom: 16px" align="center">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKey"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.svg" />
            <div class="title">HAIF OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in routes" :key="item.path"
          >{{ item.name }}
        </a-menu-item>
        <a-menu-item key="2">Solution</a-menu-item>
        <a-menu-item key="3">Cloud Service</a-menu-item>
        <a-menu-item key="4">Cooperation</a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>{{ store.state.user?.loginUser?.userName ?? "未登录" }}</div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";

const router = useRouter();

// 默认跳转为主页
const selectedKey = ref(["/"]);

// 路由跳转后更新跳转的菜单
router.afterEach((to, from, failure) => {
  selectedKey.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const store = useStore();
// console.log(store.state.user?.loginUser?.userName ?? "未登录");

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    // userName: "HAIF",
    // role: "admin",
  });
}, 3000);
</script>

<style scoped>
#globalHeader {
}

#globalHeader .title-bar {
}

.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
}

.title {
  color: #444;
  margin-left: 16px;
}
</style>
