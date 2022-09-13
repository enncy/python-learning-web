import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { store } from "../store";
import { createSimplifyLoginWindow } from "../utils";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/learning",
  },

  {
    path: "/admin",
    component: () => import("../page/admin/index.vue"),
    meta: {
      name: "管理系统",
    },
    children: [
      {
        path: "analyze",
        component: () => import("../page/admin/index.vue"),
        meta: {
          icon: "icon-piechart",
          title: "数据分析",
        },
      },
      {
        path: "user",
        component: () => import("../page/admin/index.vue"),
        meta: {
          icon: "icon-user",
          title: "用户管理",
        },
        children: [
          {
            path: "list",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "用户列表",
            },
          },
          {
            path: "new",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "新建用户",
            },
          },
        ],
      },
      {
        path: "bbs",
        component: () => import("../page/admin/index.vue"),
        meta: {
          icon: "icon-earth",
          title: "论坛管理",
        },
        children: [
          {
            path: "board/list",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "版块管理",
            },
          },
          {
            path: "category/list",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "分区管理",
            },
          },
          {
            path: "post/list",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "文章管理",
            },
          },
          {
            path: "post/new",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "新建文章",
            },
          },
        ],
      },
      {
        path: "cj",
        component: () => import("../page/admin/index.vue"),
        meta: {
          icon: "icon-CodeSandbox",
          title: "题库管理",
        },
        children: [
          {
            path: "list",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "题库列表",
            },
          },
          {
            path: "new",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "新建题目",
            },
          },
        ],
      },
      {
        path: "learning",
        component: () => import("../page/admin/index.vue"),
        meta: {
          icon: "icon-book",
          title: "教程管理",
        },
        children: [
          {
            path: "/admin/learning/list",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "教程管理",
            },
          },
          {
            path: "/admin/learning/new",
            component: () => import("../page/admin/index.vue"),
            meta: {
              title: "新建教程",
            },
          },
        ],
      },
      {
        path: "compiler/setting",
        component: () => import("../page/admin/index.vue"),
        meta: {
          icon: "icon-codelibrary",
          title: "编译器管理",
        },
      },
      {
        path: "system/setting",
        component: () => import("../page/admin/index.vue"),
        meta: {
          icon: "icon-desktop",
          title: "系统设置",
        },
      },
    ],
  },
  {
    path: "/bbs",
    redirect: "/bbs/board",
    component: () => import("../page/bbs/index.vue"),
    meta: {
      name: "论坛",
    },
    children: [
      {
        path: "board",
        component: () => import("../page/bbs/board.vue"),
        meta: {
          name: "首页",
        },
      },
      {
        path: "category/:categoryId",
        component: () => import("../page/bbs/category.vue"),
        meta: {
          name: "分区",
        },
      },
      {
        path: "post",
        component: () => import("../page/bbs/post.vue"),
        meta: {
          name: "文章",
        },
      },
    ],
  },

  {
    path: "/oj",
    component: () => import("../page/oj/index.vue"),
    meta: {
      name: "题库",
    },
  },
  {
    path: "/learning",
    component: () => import("../page/learning/index.vue"),
    meta: {
      name: "教程",
    },
  },
  {
    path: "/complier",
    component: () => import("../page/complier/index.vue"),
    meta: {
      name: "在线编译器",
    },
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
    path: "/user",
    component: () => import("../page/user/index.vue"),
    meta: {
      role: "user",
    },
    children: [
      {
        path: "information",
        component: () => import("../page/user/information.vue"),
      },
      {
        path: "notify",
        component: () => import("../page/user/notify.vue"),
      },
      {
        path: "message",
        component: () => import("../page/user/message.vue"),
      },
      {
        path: "bbs",
        component: () => import("../page/user/bbs.vue"),
      },
      {
        path: "learning",
        component: () => import("../page/user/learning.vue"),
      },
      {
        path: "oj",
        component: () => import("../page/user/oj.vue"),
      },
    ],
  },
  {
    path: "/@:usernameOrSlug(.*)",
    component: () => import("../page/home/index.vue"),
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
