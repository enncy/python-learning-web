<template>
  <div class="text-secondary">
    <div>
      {{ config.common.copyright }}
    </div>
    <div>
      {{ config.common.description }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { config } from "../../store";
</script>
<style scoped lang="less"></style>
