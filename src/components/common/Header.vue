<template>
  <div class="shadow-sm header">
    <template v-for="(item, index) of store.config.headers" :key="index">
      <component :is="item.component"></component>
      <div
        v-if="item.path"
        class="item"
        @click="router.push(item.path)"
        :class="{
          active: item.path === route.path,
        }"
      >
        <span> {{ item.name }} </span>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { store } from "../../store";
const route = useRoute();
const router = useRouter();
</script>
<style scoped lang="less">
.item {
  display: inline;
  padding: 12px;

  &.active {
    color: #1890ff;
  }

  &:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
}

.header {
  white-space: nowrap;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}
</style>
