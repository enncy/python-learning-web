<template>
  <CommonLayout>
    user index

    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </CommonLayout>
</template>
<script setup lang="ts">
import { Transition } from "vue";
import { useRoute } from "vue-router";
import CommonLayout from "../../layout/CommonLayout.vue";

const route = useRoute();
</script>
<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
