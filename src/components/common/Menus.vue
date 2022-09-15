<template>
  <!-- 多级嵌套路由 -->
  <a-menu
    v-model:selectedKeys="layoutStatus.selectedKeys"
    :open-keys="layoutStatus.openKeys"
  >
    <!-- 遍历菜单路由 -->
    <template v-for="route of routes">
      <RouteMenus :route="route" />
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { reactive } from "vue";

import RouteMenus from "./RouteMenus.vue";
import { RouteRecordRaw, useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    routes: RouteRecordRaw[];
  }>(),
  {}
);

const router = useRouter();

const layoutStatus = reactive({
  selectedKeys: [router.currentRoute.value.name],
  openKeys: props.routes
    .filter((r) => r.meta?.open === true)
    .map((r) => r.name),
});
</script>

<style scope lang="less"></style>
