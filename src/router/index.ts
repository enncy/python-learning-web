import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

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
    path: "/cj",
    component: () => import("../page/cj/index.vue"),
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
    path: "/:pathMatch(.*)*",
    component: () => import("../page/common/error.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
