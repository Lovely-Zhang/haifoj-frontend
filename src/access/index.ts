/**
 * 全局前置守卫，允许每次路由导航前执行一些逻辑。用于检查权限，以确保用户有权访问某些受限页面
 * to：路由导航目标的路由对象
 * from：路由导航来源的路由对象
 * next：一个函数，用于控制导航行为。你需要在该函数内调用 next 来继续导航
 */
import router from "@/router";
import store from "@/store";
import AccessEnum from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  const loginUser = store.state.user?.loginUser;
  // console.log("登录用户信息", loginUser);
  // 如果之前没登录过，则自动登录
  if (!loginUser || !loginUser.userRole) {
    await store.dispatch("user/getLoginUser");
  }
  const needAccess = (to.meta?.access as string) ?? AccessEnum.NOT_LOGIN;
  // 如果要跳转，页面必须登录
  if (needAccess !== AccessEnum.NOT_LOGIN) {
    // 如果没登录，则跳转到登录页面
    if (!loginUser || !loginUser.userRole) {
      // to.fullPath 拿到当前页面要跳转的完整的路由
      next(`user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登录了，但是权限不足，则跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  // 前边检查都通过了，这个函数会调用 next，允许路由导航继续，不调用的话，路由导航会被阻止
  next();
});

import { mapState } from "vuex";
