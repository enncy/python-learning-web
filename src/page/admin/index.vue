<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      v-model:collapsed="collapsed"
    >
      <div class="logo" :class="{ collapsed }">{{ config.admin.name }}</div>
      <Menus
        v-model:selectedKeys="store.admin.selectedKeys"
        v-model:open-keys="store.admin.openedKeys"
        theme="dark"
        mode="inline"
        :routes="routes.find((r) => r.path === '/admin')?.children || []"
      >
      </Menus>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="float-end pe-5 ps-5">
          <UserHeaderItem></UserHeaderItem>
        </div>
      </a-layout-header>
      <a-layout-content class="m-0 ms-lg-4 me-lg-4">
        <div class="admin-container mt-3 p-2 p-lg-3">
          <div class="mb-3">
            <a-breadcrumb separator=">">
              <template
                v-for="item of router.currentRoute.value.matched"
                :key="item.name"
              >
                <a-breadcrumb-item> {{ item.meta.title }} </a-breadcrumb-item>
              </template>
            </a-breadcrumb>
          </div>

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
import { useRoute, useRouter } from "vue-router";
import Menus from "../../components/common/Menus.vue";
import { routes } from "../../router";
import UserHeaderItem from "../../components/common/UserHeaderItem.vue";
import { store, config } from "../../store";

const router = useRouter();

const collapsed = ref<boolean>(false);
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
  min-height: 360px;
}
</style>
