<template>
  <div class="text-secondary">
    <div>
      {{ config.copyright }}
    </div>
    <div>
      {{ config.description }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { config } from "../../store";
</script>
<style scoped lang="less"></style>
