<template>
  <CommonLayout>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </CommonLayout>
</template>
<script setup lang="ts">
import CommonLayout from "../../layout/CommonLayout.vue";
</script>
<style scoped lang="less"></style>
