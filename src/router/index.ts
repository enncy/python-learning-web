import { message } from "ant-design-vue";
import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import { config, store } from "../store";
import { Role } from "../store/interface";
import { createSimplifyLoginWindow, getRole } from "../utils";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/learning",
  },

  {
    path: "/admin",
    name: "admin",
    redirect: "/admin/analyze",
    component: () => import("../page/admin/index.vue"),
    meta: {
      title: "管理系统",
      role: "root",
    },
    children: [
      {
        path: "analyze",
        name: "admin-analyze",
        component: () => import("../page/admin/analyze.vue"),
        meta: {
          icon: "icon-piechart",
          title: "数据分析",
        },
      },
      {
        path: "user",
        name: "admin-user",
        component: () => import("../page/admin/user/index.vue"),
        meta: {
          icon: "icon-user",
          title: "用户管理",
          open: true,
        },
        children: [
          {
            path: "list",
            component: () => import("../page/admin/user/list.vue"),
            name: "admin-user-list",
            meta: {
              title: "用户列表",
            },
          },
        ],
      },
      {
        path: "bbs",
        name: "admin-bbs",
        component: () => import("../page/admin/bbs/index.vue"),
        meta: {
          icon: "icon-earth",
          title: "论坛管理",
          open: true,
        },
        children: [
          {
            path: "board/list",
            name: "admin-bbs-board-list",
            component: () => import("../page/admin/bbs/board.vue"),
            meta: {
              title: "版块管理",
            },
          },
          {
            path: "category/list",
            name: "admin-bbs-category-list",
            component: () => import("../page/admin/bbs/category.vue"),
            meta: {
              title: "分区管理",
            },
          },
          {
            path: "post/list",
            name: "admin-bbs-post-list",
            component: () => import("../page/admin/bbs/post.vue"),
            meta: {
              title: "帖子管理",
            },
          },
          {
            path: "admin/list",
            name: "admin-bbs-admin-list",
            component: () => import("../page/admin/bbs/admin.vue"),
            meta: {
              title: "版主管理",
            },
          },
          {
            path: "comment/list",
            name: "admin-bbs-comment-list",
            component: () => import("../page/admin/bbs/comment.vue"),
            meta: {
              title: "评论管理",
            },
          },
          {
            path: "tag/list",
            name: "admin-bbs-tag-list",
            component: () => import("../page/admin/bbs/tag.vue"),
            meta: {
              title: "主题管理",
            },
          },
        ],
      },

      {
        path: "learning",
        name: "admin-learning",
        component: () => import("../page/admin/learning/index.vue"),
        meta: {
          icon: "icon-book",
          title: "教程管理",
          open: true,
        },
        children: [
          {
            path: "list",
            name: "admin-learning-list",
            component: () => import("../page/admin/learning/list.vue"),
            meta: {
              title: "教程列表",
            },
          },
        ],
      },
      {
        path: "compiler",
        name: "admin-compiler",
        component: () => import("../page/admin/compiler/index.vue"),
        meta: {
          icon: "icon-codelibrary",
          title: "编译器管理",
          open: true,
        },
        children: [
          {
            path: "codes",
            name: "admin-compiler-codes",
            component: () => import("../page/admin/compiler/codes.vue"),
            meta: {
              title: "代码列表",
            },
          },
          {
            path: "records",
            name: "admin-compiler-records",
            component: () => import("../page/admin/compiler/records.vue"),
            meta: {
              title: "编译记录",
            },
          },
        ],
      },
      {
        path: "system",
        name: "admin-system",
        component: () => import("../page/admin/system/index.vue"),
        meta: {
          icon: "icon-desktop",
          title: "系统管理",
          open: true,
        },
        children: [
          {
            path: "config",
            name: "admin-system-config",
            component: () => import("../page/admin/system/config.vue"),
            meta: {
              title: "配置列表",
            },
          },
        ],
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
        path: "post/:postId",
        component: () => import("../page/bbs/post.vue"),
        meta: {
          name: "帖子",
        },
      },
      {
        path: "new/:categoryId",
        component: () => import("../page/bbs/publish.vue"),
        meta: {
          name: "发布帖子",
        },
      },
      {
        path: "modify/:postId",
        component: () => import("../page/bbs/publish.vue"),
        meta: {
          name: "修改帖子",
        },
      },
    ],
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
    ],
  },
  {
    path: "/@:usernameOrSlug(.*)",
    component: () => import("../page/home/index.vue"),
  },
  {
    path: "/test",
    component: () => import("../page/test.vue"),
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
  const role = getMatchedRole(to);
  // 权限判断
  if (role) {
    if (store.user) {
      const pass = getRole(store.user.role).level >= getRole(role).level;
      if (!pass) {
        message.error("权限不足！");
        router.replace("/404");
      } else {
        return true;
      }
    } else {
      // 需要登录
      createSimplifyLoginWindow();
      return false;
    }
  }
  return true;
});

/** 获取权限  */
function getMatchedRole(to: RouteLocationNormalized): Role {
  return to.matched.find((r) => r.meta.role)?.meta.role as Role;
}
