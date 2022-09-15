<template>
  <template v-if="adaption">
    <div class="ms-lg-4 me-lg-5 user-menus" @click="visible = true">
      <a class="ant-dropdown-link" @click.prevent>
        <Icon type="icon-user" />
        {{ store.user?.username || store.user?.nickname || "未登录" }}
      </a>
    </div>
    <a-drawer
      :closable="false"
      v-model:visible="visible"
      :body-style="{
        padding: '0px',
      }"
      width="240"
      placement="right"
    >
      <div class="p-4 pb-0">
        <Icon type="icon-user" />
        {{ store.user?.username || store.user?.nickname || "未登录" }}
        <a-divider></a-divider>
      </div>
      <UserMenus :menus="menus" :adaption="true"></UserMenus>
    </a-drawer>
  </template>

  <template v-else>
    <a-dropdown class="ms-lg-4 me-lg-5 me-3">
      <div class="ms-lg-4 me-lg-5 user-menus">
        <a class="ant-dropdown-link" @click.prevent>
          <Icon type="icon-user" />
          {{ store.user?.username || store.user?.nickname || "未登录" }}
        </a>
      </div>

      <template #overlay>
        <UserMenus :menus="menus" :adaption="false"></UserMenus>
      </template>
    </a-dropdown>
  </template>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { store, config } from "../../store";
import Icon from "./Icon.vue";
import UserMenus from "./UserMenus.vue";

interface MyMenus {
  divider?: boolean;
  path?: string;
  component?: any;
  name?: string;
  icon?: string;
}
const visible = ref(false);

// 是否开启自适应
const adaption = ref(
  document.documentElement.clientWidth < config.adaption.breaking_point
);
// 监听变化
watch(adaption, () => {
  menus.value = getMenus();
});

// 获取自适应菜单
function getMenus() {
  const newMenus = [];

  if (adaption.value) {
    newMenus.push(...config.headers.filter((h) => h.adaption === true));
  }

  if (store.user?.role === "visitor") {
    newMenus.push(...config.userMenus["visitor"]);
  } else {
    if (store.user?.role === "admin") {
      newMenus.push(...config.userMenus["admin"]);
    }
    newMenus.push(...config.userMenus["user"]);
  }

  return newMenus;
}

const menus = ref<MyMenus[]>(getMenus());

window.onresize = () => {
  adaption.value =
    document.documentElement.clientWidth < config.adaption.breaking_point;
};
</script>
<style scoped lang="less">
:deep(.ant-menu-item) {
  margin: 0px;
  margin-bottom: 0px !important;
}
.user-menus {
  max-width: 200px !important;
}
</style>
