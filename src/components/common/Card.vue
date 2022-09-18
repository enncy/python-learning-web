<template>
  <div class="p-3 shadow rounded my-card bg-white">
    <template v-if="title">
      <h3>{{ title }}</h3>
      <a-divider class="mb-3 mt-1" />
    </template>

    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>
<style scoped lang="less">
.my-card + .my-card {
  margin-top: 36px;
}
</style>
