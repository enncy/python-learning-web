<template>
  <a-config-provider :locale="zhCN">
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component
          :class="{ 'in-mobile': store.state.inMobile }"
          :is="Component"
        />
      </Transition>
    </router-view>
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

import { onMounted, Transition } from "vue";
import { store, config } from "./store";

dayjs.locale("zh-cn");

const fieldname = () => `store-${config.version}`;

onMounted(async () => {
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(fieldname(), JSON.stringify(store));
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
