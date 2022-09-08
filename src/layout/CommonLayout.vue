<template>
  <Header class="header w-100"></Header>

  <div class="common-layout-container">
    <slot></slot>
  </div>
  <Footer class="footer"></Footer>
</template>

<script setup lang="ts">
import Footer from "../components/common/Footer.vue";
import Header from "../components/common/Header.vue";
</script>
<style scoped lang="less">
.common-layout-container {
  min-height: 100vh;
}
.header {
}
.footer {
  text-align: center;
  padding: 12px;
}
</style>
