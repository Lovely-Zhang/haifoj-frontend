// initial state
import { StoreOptions } from "vuex";
import AccessEnum from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

/**
 * state：               存储的状态信息，比如用户信息
 * mutations（尽量同步）： 定义了对变量进行增删改（更新）的方法
 * actions（支持异步）：   执行异步操作，并且触发 mutations 更改（actions 调用 mutations）
 * modules（摸块）：      把一个大的 state（全局变量）划分为多个小模块，比如 user 专门存用户的状态信息
 */
export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
      userRole: AccessEnum.NOT_LOGIN,
    },
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      // todo 改为从远程请求获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: AccessEnum.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
