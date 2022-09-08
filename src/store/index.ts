import { MenuDivider } from "ant-design-vue";
import { defineAsyncComponent, reactive, shallowRef } from "vue";

export const store = reactive({
  data: {
    user: undefined as Record<string, any> | undefined,
  },
  config: {
    name: "Python学习网",
    copyright: "Copyright © 2022 Python学习网",
    description:
      "Python学习网 —— 拥有在线学习系统，在线代码测评系统，以及论坛系统，可以自学Python，对各种例子进行自测，与各大网友分享技术，共同建造和谐的开源社区",
    headers: [
      {
        component: shallowRef(
          defineAsyncComponent(() => import("../components/common/Logo.vue"))
        ),
      },
      {
        path: "/learning",
        name: "教程",
      },
      {
        path: "/cj",
        name: "题库",
      },
      {
        path: "/bbs",
        name: "论坛",
      },
      {
        path: "/complier",
        name: "在线编译器",
      },
      {
        component: shallowRef(
          defineAsyncComponent(
            () => import("../components/common/SearchInput.vue")
          )
        ),
      },
      {
        component: shallowRef(
          defineAsyncComponent(
            () => import("../components/common/UserMenus.vue")
          )
        ),
      },
      {
        path: "/user/message",
        name: "消息",
      },
      {
        path: "/user/notify",
        name: "通知",
      },
    ],
    userMenus: {
      normal: [
        {
          path: "/user",
          name: "个人中心",
          icon: "icon-user",
        },
        {
          path: "/bbs/post",
          name: "我的论坛",
          icon: "icon-comment",
        },
        {
          path: "/learning/analyze",
          name: "我的学习",
          icon: "icon-book",
        },
        {
          path: "/learning/analyze",
          name: "我的题库",
          icon: "icon-edit",
        },
        {
          component: shallowRef(MenuDivider),
        },
        {
          path: "/logout",
          name: "退出",
          icon: "icon-logout",
        },
      ],
      visitor: [
        {
          path: "/login",
          name: "登录",
          icon: "icon-login",
        },
        {
          path: "/register",
          name: "注册",
          icon: "icon-adduser",
        },
      ],
      admin: [],
    },
  },
});
