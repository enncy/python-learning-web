<template>
  <div class="p-3 rounded-2 shadow-sm border my-card">
    <slot></slot>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="less">
.my-card + .my-card {
  margin-top: 24px;
}
</style>
