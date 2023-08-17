<template>
  <a-row align="center" :wrap="false">
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
        <a-menu-item v-for="item in visibleRoutes" :key="item.path"
          >{{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <a-dropdown @select="handleSelect">
        <a-button
          type="primary"
          @click="doMenuClick('/user/login')"
          v-if="buttonText === '未登录'"
          >{{ buttonText }}
        </a-button>
        <a-button type="primary" v-else>{{ buttonText }}</a-button>
        <template #content>
          <!--          <a-doption @click="doMenuClick('/user/login')">个人中心</a-doption>-->
          <a-doption
            v-for="item in personal()"
            :key="item.path"
            :value="item.path"
            >{{ item.name }}
          </a-doption>
          <a-doption @click="UserControllerService.userLogoutUsingPost()"
            >退出登录
          </a-doption>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { UserControllerService } from "../../generated/services/UserControllerService";

const router = useRouter();
let store = useStore();

/**
 * 使用计算属性，当登录用户信息发生变更时，触发菜单栏的重新渲染
 * 需要展示在页面的路由数组
 */
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // todo 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

const personal = () => {
  return routes[0].children?.filter((item, index) => {
    if (item.meta?.access !== "personal") {
      return false;
    }
    return true;
  });
};

onMounted(() => {
  console.log(personal(), "dsdsss");
});

// 默认跳转为主页
const selectedKey = ref(["/"]);

/**
 * 每次路由导航后执行一些逻辑，一般用于页面滚动或统计
 * 路由跳转后,更新跳转的菜单
 */
router.afterEach((to, from, failure) => {
  selectedKey.value = [to.path];
});

// 点击跳转到对应页面
const doMenuClick = (key: string) => {
  // 使用编程式导航跳转到登录页面
  router.push({
    path: key,
  });
};

const buttonText = computed(() => {
  if (store.state.user?.loginUser?.userName !== null) {
    return store.state.user?.loginUser?.userName;
  }
  return "未登录";
});

const handleSelect = (v: any) => {
  if (v === "退出登录") {
    store.state.user = null;
  }
  console.log(buttonText);
  doMenuClick(v);
};
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

.arco-dropdown-open .arco-icon-down {
  transform: rotate(180deg);
}
</style>
