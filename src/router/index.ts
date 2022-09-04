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
    path: "/login",
    component: () => import("../page/common/login.vue"),
  },
  {
    path: "/register",
    component: () => import("../page/common/register.vue"),
  },
  {
    path: "/reset",
    component: () => import("../page/common/reset.vue"),
  },
  {
    path: "/forget-password",
    component: () => import("../page/common/forget-password.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
