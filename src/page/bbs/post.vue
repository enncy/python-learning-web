<template>
  <div class="container mt-3">
    <div class="mb-3">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <Icon type="icon-home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/board')">
          论坛首页
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>
<style scoped lang="less"></style>
