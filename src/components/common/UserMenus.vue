<template>
  <a-dropdown class="ms-4 me-5">
    <a class="ant-dropdown-link" @click.prevent>
      <Icon type="icon-user" />
      {{ store.user?.username || store.user?.nickname || "未登录" }}
    </a>
    <template #overlay>
      <a-menu>
        <template v-for="(item, index) of menus" :key="index">
          <a-menu-item>
            <component :is="item.component"></component>
            <div v-if="item.path" class="item" @click="router.push(item.path)">
              <Icon class="ms-2 me-2" :type="item.icon" />
              <span> {{ item.name }} </span>
            </div>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { store, config } from "../../store";
import Icon from "./Icon.vue";

const router = useRouter();

const menus = computed(
  () => config.userMenus[store.user ? store.user.role : "visitor"]
);
</script>
<style scoped lang="less">
.item {
  width: 180px;
  padding: 4px 0px;
  display: inline-block;
}
</style>
