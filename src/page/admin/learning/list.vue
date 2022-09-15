<template>
  <div>{{ route.name }}</div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>
<style scoped lang="less"></style>
