<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      v-model:collapsed="collapsed"
    >
      <div class="logo" :class="{ collapsed }">Python学习网管理系统</div>
      <Menus
        theme="dark"
        mode="inline"
        :routes="routes.find((r) => r.path === '/admin')?.children || []"
      >
      </Menus>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content class="m-0 ms-lg-4 me-lg-4">
        <div class="admin-container mt-3 p-2 p-lg-3">
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
import { routes } from "../../router";

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
  background: #fff;
  min-height: 360px;
}
</style>
