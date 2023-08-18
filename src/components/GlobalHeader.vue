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
      <a-dropdown :trigger="['hover']" @select="handleSelect">
        <div class="content">
          <a-typography-text class="text">{{ buttonText }}</a-typography-text>
          <a-image
            width="45"
            src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
          />
        </div>
        <template #content v-if="buttonText === '未登录'">
          <a-doption :value="{ value: '/user/login', name: '登录' }"
            >账号登录
          </a-doption>
          <a-doption :value="{ value: '/user/register', name: '注册' }"
            >账号注册
          </a-doption>
        </template>
        <template #content v-else>
          <a-doption
            v-for="item in personal()"
            :key="item.path"
            :value="{ value: item.path, name: item.name }"
            >{{ item.name }}
          </a-doption>
          <a-doption :value="{ value: '/user/login', name: '退出登录' }"
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

// 钩子函数
onMounted(() => {
  // console.log("");
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
  const userLogin = store.state.user?.loginUser;
  if (userLogin?.userName !== null) {
    return userLogin?.userName;
  }
  return "未登录";
});

const handleSelect = (v: any) => {
  if (v.name === "退出登录") {
    UserControllerService.userLogoutUsingPost();
    location.reload();
  } else {
    doMenuClick(v.value);
  }
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

.content {
  display: flex; /* 使内部元素水平排列 */
  align-items: center; /* 垂直居中对齐 */
  gap: 10px; /* 设置内部元素之间的间距 */
}
.content.text {
  font-size: 18px;
  font-weight: bold;
}
</style>
