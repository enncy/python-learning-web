<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { onBeforeMount, onMounted, ref, Transition } from "vue";
import { UserApi } from "./api";
import { store, config } from "./store";

const fieldname = `store-${config.version}`;

onBeforeMount(() => {
  const localStore = JSON.parse(localStorage.getItem(fieldname) || "{}");
  Object.assign(store, localStore);

  // 自动登录
  if (store.user) {
    UserApi.login({
      type: "password",
      ...store.user,
    }).then(({ data: { data } }) => {
      if (!data) {
        message.error("自动登录失败，本地信息有误，请重新登录。");
      }
    });
  }
});

onMounted(() => {
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(fieldname, JSON.stringify(store));
  });
  console.log("loading 2", Date.now());
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
