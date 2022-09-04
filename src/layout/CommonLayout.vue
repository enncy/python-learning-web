<template>
  <Header></Header>
  <slot></slot>
  <Footer></Footer>
</template>

<script setup lang="ts">
import Footer from "../components/common/Footer.vue";
import Header from "../components/common/Header.vue";
</script>
<style scoped lang="less">
.common-layout-body {
  height: calc(99% - var(--header-height) - var(--footer-height));
}
</style>
