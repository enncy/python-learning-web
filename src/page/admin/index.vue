<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" :class="{ collapsed }">Python学习网管理系统</div>
      <Menus
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        :menus="menus"
      >
      </Menus>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="admin-container">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Python学习网管理系统 © 2022 create by enncy
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import { MenuItemProps } from "ant-design-vue";
import { ref } from "vue";
import Menus from "../../components/common/Menus.vue";

interface MenuItem extends MenuItemProps {
  children?: MenuItem[];
  path?: string;
}

const menus: MenuItem[] = [
  {
    path: "/admin/analyze",
    icon: "icon-piechart",
    title: "数据分析",
  },
  {
    icon: "icon-user",
    title: "用户管理",
    children: [
      {
        path: "/admin/user/lst",
        title: "用户列表",
      },
      {
        path: "/admin/user/new",
        title: "新建用户",
      },
    ],
  },

  {
    icon: "icon-earth",
    title: "论坛管理",
    children: [
      {
        path: "/admin/bbs/board/list",
        title: "版块管理",
      },
      {
        path: "/admin/bbs/category/list",
        title: "分区管理",
      },
      {
        path: "/admin/bbs/post/list",
        title: "文章管理",
      },
      {
        path: "/admin/bbs/post/new",
        title: "新建文章",
      },
    ],
  },
  {
    icon: "icon-CodeSandbox",
    title: "题库管理",
    children: [
      {
        path: "/admin/cj/list",
        title: "题库列表",
      },
      {
        path: "/admin/cj/new",
        title: "新建题目",
      },
    ],
  },
  {
    icon: "icon-book",
    title: "教程管理",
    children: [
      {
        path: "/admin/learning/list",
        title: "教程管理",
      },
      {
        path: "/admin/learning/new",
        title: "新建教程",
      },
    ],
  },
  {
    path: "/admin/compiler/setting",
    icon: "icon-codelibrary",
    title: "编译器管理",
  },
  {
    path: "/admin/system/setting",
    icon: "icon-desktop",
    title: "系统设置",
  },
];

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(["1"]);
</script>
<style scoped lang="less">
.logo {
  height: 64px;
  display: flex;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.logo.collapsed {
  visibility: hidden;
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}

.admin-container {
  padding: 24px;
  background: #fff;
  min-height: 360px;
}
</style>
