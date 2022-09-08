<template>
  <div class="h-100 d-flex align-items-center p-lg-0 p-2 passport-layout">
    <div class="m-md-auto col-12 col-lg-3 col-md-8 passport-layout-container">
      <div class="pt-2 pb-2 text-end">
        <a-button
          style="text-shadow: white 0px 2px 1px"
          type="link"
          @click="router.push('/')"
          >返回首页-></a-button
        >
      </div>
      <div class="shadow rounded p-5">
        <slot></slot>
      </div>

      <div class="mt-5 text-center">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Footer from "../../components/common/Footer.vue";

const router = useRouter();
</script>

<style scoped lang="less">
.passport-layout {
  background-color: #ffffff;
}
.input-list {
  padding: 12px;

  :deep(& > span[class*="ant-input"]) {
    margin-bottom: 24px;
    border-bottom: 1px solid rgb(199, 198, 198);
  }
}

.passport-layout-container {
  min-width: 360px;
}
</style>
