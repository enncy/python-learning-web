<template>
  <Transition name="fade" mode="out-in">
    <template v-if="loading">
      <a-skeleton active></a-skeleton>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </Transition>
</template>
<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>
<style scoped lang="less"></style>
