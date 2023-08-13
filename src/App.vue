<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<style>
#app {
}
</style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AccessEnum from "@/access/accessEnum";
import { onMounted } from "vue";

const router = useRouter();
const store = useStore();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("hello， 欢迎来到我的项目");
};

onMounted(() => {
  doInit();
});

/**
 * 全局前置守卫，允许每次路由导航前执行一些逻辑。用于检查权限，以确保用户有权访问某些受限页面
 * to：路由导航目标的路由对象
 * from：路由导航来源的路由对象
 * next：一个函数，用于控制导航行为。你需要在该函数内调用 next 来继续导航
 */
router.beforeEach((to, from, next) => {
  if (to.meta?.access === AccessEnum.ADMIN) {
    // console.log(store.state.user?.loginUser);
    if (store.state.user?.loginUser?.userRole !== "admin") {
      next("/noAuth");
      return;
    }
  }
  // 前边检查都通过了，这个函数会调用 next，允许路由导航继续，不调用的话，路由导航会被阻止
  next();
});
</script>
