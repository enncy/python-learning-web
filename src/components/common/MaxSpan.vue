<template>
  <span>
    {{ max(value, length) }}
  </span>
</template>
<script setup lang="ts">
import { max } from "../../utils";

defineProps<{
  value: string;
  length: number;
}>();
</script>
<style scoped lang="less"></style>
