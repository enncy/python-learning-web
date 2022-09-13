<template>
  <!-- 如果存在子路由 -->
  <template v-if="menu.children">
    <a-sub-menu :key="menu.title" :title="menu.title">
      <template #icon>
        <Icon v-if="menu.icon" :type="menu.icon" />
      </template>
      <template v-for="children of menu.children">
        <!-- 递归 -->
        <RouteMenus :menu="children" />
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="menu.title" @click="menu.onClick">
      <Icon v-if="menu.icon" :type="menu.icon" />
      <span class="nav-text"> {{ menu.title }} </span>
    </a-menu-item>
  </template>
</template>

<script setup lang="ts">
import { MenuItemProps } from "ant-design-vue";
import { useRouter } from "vue-router";
import Icon from "./Icon.vue";

withDefaults(
  defineProps<{
    menu: MenuItemProps & {
      children?: MenuItemProps[];
    };
  }>(),
  {}
);
</script>

<style scope lang="less"></style>
