<template>
  <div class="h-100 w-100">
    <Header class="w-100"></Header>
    <slot></slot>
    <Footer class="footer"></Footer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import Footer from "../components/common/Footer.vue";
import Header from "../components/common/Header.vue";
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      // @ts-ignore 删除加载动画
      demo.spinner._canvas.remove();
    }, 1000);
  });
});
</script>
<style scoped lang="less">
.footer {
  text-align: center;
  padding: 12px;
  margin-top: 64px;
}
</style>
