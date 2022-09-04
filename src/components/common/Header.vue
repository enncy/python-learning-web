<template>
  <div class="header border-bottom">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="less">
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  height: var(--header-height);

  .item {
    display: inline;
    margin: 12px 24px;
  }
}
</style>
