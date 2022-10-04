<template>
  <div class="h-100 w-100">
    <Header
      class="w-100 p-2 p-lg-0 bg-white"
      :class="{
        'shadow-sm': noShadow ? false : true,
      }"
    ></Header>

    <slot></slot>
    <Footer class="footer"></Footer>
  </div>
</template>

<script setup lang="ts">
import Footer from "../components/common/Footer.vue";
import Header from "../components/common/Header.vue";

defineProps<{
  noShadow?: boolean;
}>();
</script>
<style scoped lang="less">
.footer {
  text-align: center;
  padding: 12px;
  margin-top: 64px;
}

:deep(.ant-breadcrumb-link) {
  cursor: pointer;
}
</style>
