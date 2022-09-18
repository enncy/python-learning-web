<template>
  <div class="ps-5 pe-5">
    <a-input-search
      v-model:value="value"
      placeholder="搜索站内的帖子或者内容"
      enter-button
      class="search-input"
      @search="onSearch"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const value = ref("");

function onSearch() {}
</script>
<style scoped lang="less">
.search-input {
  width: 300px;
  max-width: 500px;
  min-width: 200px;
}
</style>
