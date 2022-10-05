<template>
  <a-result status="404" title="抱歉，此页面走丢了~">
    <template #extra>
      <a-button type="primary" @click="router.back()"> 返回上一页 </a-button>
    </template>
  </a-result>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>
<style scoped lang="less"></style>
