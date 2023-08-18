<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("hello， 欢迎来到我的项目");
  store.dispatch("user/getLoginUser");
};

// 刚进页面会执行此代码
onMounted(() => {
  doInit();
});
</script>
<!--<script>-->
<!--&lt;!&ndash; 根据当前路由的 meta.layout 属性切换不同的布局组件 &ndash;&gt;-->
<!--<component :is="layoutComponent">-->
<!--  <router-view />-->
<!--  </component>-->
<!--import { mapState } from "vuex";-->

<!--export default {-->
<!--  computed: {-->
<!--    ...mapState("user", ["loggedInUser"]), // 获取登录用户信息-->
<!--    layoutComponent() {-->
<!--      // 根据登录状态和角色权限，决定使用哪个布局-->
<!--      if (this.loggedInUser) {-->
<!--        // 已登录-->
<!--        if (this.loggedInUser.role === "admin") {-->
<!--          return "AdminLayout"; // 管理员布局-->
<!--        } else {-->
<!--          return "BasicLayout"; // 普通用户布局-->
<!--        }-->
<!--      } else {-->
<!--        return "UserLayout"; // 未登录使用登录布局-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
