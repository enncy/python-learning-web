import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { store } from "../store";
import { createSimplifyLoginWindow } from "../utils";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/learning",
  },
  {
    path: "/bbs",
    component: () => import("../page/bbs/index.vue"),
  },
  {
    path: "/oj",
    component: () => import("../page/oj/index.vue"),
  },
  {
    path: "/learning",
    component: () => import("../page/learning/index.vue"),
  },
  {
    path: "/complier",
    component: () => import("../page/complier/index.vue"),
  },
  {
    path: "/login",
    component: () => import("../page/passport/login.vue"),
  },
  {
    path: "/simplify-login",
    component: () => import("../page/passport/SimplifyLogin.vue"),
  },
  {
    path: "/logout",
    component: () => import("../page/passport/logout.vue"),
  },
  {
    path: "/register",
    component: () => import("../page/passport/register.vue"),
  },
  {
    path: "/reset",
    component: () => import("../page/passport/reset.vue"),
  },
  {
    path: "/forget-password",
    component: () => import("../page/passport/forget-password.vue"),
  },
  {
    path: "/user/:username",
    component: () => import("../page/user/index.vue"),
    meta: {
      role: "user",
    },
    children: [
      {
        path: "notify",
        component: () => import("../page/user/notify.vue"),
      },
      {
        path: "message",
        component: () => import("../page/user/message.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../page/common/error.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  // 权限判断
  if (to.meta?.role && to.meta.role !== "visitor") {
    if (store.user) {
      // 如果是管理员可通过
      if (store.user.role === "admin") {
        return true;
      }

      return to.meta.role === store.user.role;
    } else {
      // 需要登录
      createSimplifyLoginWindow();
      return false;
    }
  }
  return true;
});
