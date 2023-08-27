import { RouteRecordRaw } from "vue-router";
import ExampleView from "@/views/ExampleView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import AccessEnum from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import PersonalCenterView from "@/views/user/PersonalCenterView.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/personal",
        name: "个人中心",
        component: PersonalCenterView,
        meta: {
          access: "personal",
        },
      },
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: "true",
    },
  },
  {
    path: "/",
    name: "主页",
    component: ExampleView,
  },
  {
    path: "/questions",
    name: "浏览题目",
    component: QuestionsView,
  },
  {
    path: "/question/manage",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/question/add",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: AccessEnum.ADMIN,
    },
  },
  {
    path: "/question/update",
    name: "修改题目",
    component: AddQuestionView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: AccessEnum.USER,
      hideInMenu: true,
    },
  },
  // {
  //   path: "/admin",
  //   name: "仅管理员可见",
  //   component: AdminView,
  //   meta: {
  //     access: AccessEnum.ADMIN,
  //   },
  // },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: "true",
    },
  },
];
