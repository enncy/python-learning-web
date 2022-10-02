<template>
  <a-config-provider :locale="zhCN">
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

import { onBeforeMount, onMounted, Transition } from "vue";
import { CommonApi } from "./api/common";
import { store, config } from "./store";
import set from "lodash/set";

dayjs.locale("zh-cn");

const fieldname = `store-${config.version}`;

onBeforeMount(() => {
  const localStore = JSON.parse(localStorage.getItem(fieldname) || "{}");
  Object.assign(store, localStore);
});

onMounted(async () => {
  console.log({ store, config });

  CommonApi.listConfig().then(({ data: { data } }) => {
    if (data) {
      for (const item of data) {
        const value =
          item.type === "number"
            ? parseFloat(item.value)
            : item.type === "object"
            ? JSON.parse(item.value)
            : item.type === "date"
            ? new Date(item.value)
            : item.value;
        console.log(item.key, value);

        set(config, item.key, value);
      }
    }
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(fieldname, JSON.stringify(store));
  });
});
</script>
<style scoped>
.spin,
.spin-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 200px;
}
</style>
