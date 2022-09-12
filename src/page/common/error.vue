<template>
  <CommonLayout>
    <div class="w-100 h-100 d-flex justify-content-center">
      <div class="mt-5 pt-5">
        <a-result
          status="404"
          title="404 NOT FOUND"
          sub-title="抱歉，此页面走丢了~"
        >
          <template #extra>
            <a-button type="primary" @click="router.push('/')">
              返回首页
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
  </CommonLayout>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import CommonLayout from "../../layout/CommonLayout.vue";
const router = useRouter();
</script>
<style scoped lang="less"></style>
