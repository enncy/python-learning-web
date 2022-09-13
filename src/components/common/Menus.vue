<template>
  <!-- 多级嵌套路由 -->
  <a-menu
    v-model:selectedKeys="layoutStatus.selectedKeys"
    :open-keys="layoutStatus.openKeys"
  >
    <!-- 遍历菜单路由 -->
    <template v-for="menu of menus">
      <RouteMenus :menu="menu" />
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { MenuItemProps } from "ant-design-vue";
import RouteMenus from "./RouteMenus.vue";

const layoutStatus = reactive({
  selectedKeys: [],
  openKeys: [],
});

withDefaults(
  defineProps<{
    menus: MenuItemProps[];
  }>(),
  {}
);
</script>

<style scope lang="less"></style>
