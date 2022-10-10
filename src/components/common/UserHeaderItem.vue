<template>
  <template v-if="store.state.inMobile">
    <div class="ms-lg-4 me-lg-5 user-menus" @click="visible = true">
      <a class="ant-dropdown-link" @click.prevent>
        <Avatar class="me-2" :size="32" :user="user" :stop="true"></Avatar>
        <span>
          {{ store.user?.nickname || store.user?.username || "未登录" }}
        </span>
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
        <Avatar class="me-2" :size="32" :user="user"></Avatar>
        <span>{{
          store.user?.nickname || store.user?.username || "未登录"
        }}</span>
        <a-divider></a-divider>
      </div>
      <UserMenus :menus="menus" :adaption="true"></UserMenus>
    </a-drawer>
  </template>

  <template v-else>
    <a-dropdown class="ms-lg-4 me-lg-5 me-3">
      <div class="ms-lg-4 me-lg-5 user-menus">
        <a class="ant-dropdown-link" @click.prevent>
          <Avatar class="me-2" :size="32" :user="user"></Avatar>
          <span>
            {{ store.user?.nickname || store.user?.username || "未登录" }}</span
          >
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
import Avatar from "./Avatar.vue";

const user = store.user;

interface MyMenus {
  divider?: boolean;
  path?: string;
  component?: any;
  name?: string;
  icon?: string;
}
const visible = ref(false);

// 监听变化
watch(
  () => store.state.inMobile,
  () => {
    menus.value = getMenus();
  }
);

// 获取自适应菜单
function getMenus() {
  const newMenus = [];

  if (store.state.inMobile) {
    newMenus.push(...config.headers.filter((h) => h.adaption === true));
  }

  const userRole = config.roles.find((r) => r.name === store.user?.role);

  if (userRole) {
    const { visitor, ...menus } = config.userMenus;

    // 根据级别获得相应的菜单
    config.roles.forEach((role) => {
      if (userRole.level >= role.level && menus[role.name]) {
        newMenus.push(...menus[role.name]);
      }
    });

    return newMenus;
  } else {
    return config.userMenus["visitor"];
  }
}

const menus = ref<MyMenus[]>(getMenus());
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
