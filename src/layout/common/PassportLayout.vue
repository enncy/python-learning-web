<template>
  <div class="h-100 d-flex align-items-center p-lg-0 p-2 passport-layout">
    <div class="m-md-auto col-12 col-lg-3 col-md-8 shadow rounded p-5 bg-white">
      <h1 class="text-start">{{ store.app_name }}</h1>
      <a-divider></a-divider>

      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "../../store";
</script>

<style scoped lang="less">
.passport-layout {
  background: url("@/assets/imgs/passport-background.png");
  background-color: #61c7ee38;
}
.input-list {
  padding: 12px;

  :deep(& > *) {
    margin-bottom: 24px;
    border-bottom: 1px solid rgb(199, 198, 198);
  }
}
</style>
