<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { onBeforeMount, onMounted, Transition } from "vue";
import { UserApi } from "./api";
import { store, config } from "./store";

const fieldname = `store-${config.version}`;

onBeforeMount(() => {
  const localStore = JSON.parse(localStorage.getItem(fieldname) || "{}");
  Object.assign(store, localStore);
});

onMounted(() => {
  console.log({ store, config });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(fieldname, JSON.stringify(store));
  });
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

.spin,
.spin-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 200px;
}
</style>
