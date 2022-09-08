<template>
  <a-input-search
    v-model:value="value"
    placeholder="搜索站内的文章或者内容"
    enter-button
    class="search-input ms-5 me-5 ms-5 me-5"
    @search="onSearch"
  />
</template>
<script setup lang="ts">
import { ref } from "vue";

const value = ref("");

function onSearch() {}
</script>
<style scoped lang="less">
.search-input {
  max-width: 500px;
  min-width: 200px;
}
</style>
