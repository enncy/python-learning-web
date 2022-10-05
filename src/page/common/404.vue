<template>
  <CommonLayout>
    <div class="w-100 d-flex justify-content-center">
      <div class="mt-5 pt-5">
        <NotFound></NotFound>
      </div>
    </div>
  </CommonLayout>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import CommonLayout from "../../layout/CommonLayout.vue";
import NotFound from "../../components/common/NotFound.vue";
const router = useRouter();
</script>
<style scoped lang="less"></style>
