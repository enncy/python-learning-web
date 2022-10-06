<template>
  <div class="p-3 shadow rounded my-card bg-white">
    <template v-if="title">
      <h3>{{ title }}</h3>
      <a-divider class="mb-3 mt-1" />
    </template>

    <template v-else-if="slot.title">
      <component :is="slot.title"></component>
      <a-divider class="mb-3 mt-1" />
    </template>

    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { useSlots } from "vue";

defineProps<{
  title?: string;
}>();

const slot = useSlots();
</script>
<style scoped lang="less">
.my-card + .my-card {
  margin-top: 36px;
}
</style>
