<template>
  <div class="text-secondary">
    <div>
      {{ store.config.copyright }}
    </div>
    <div>
      {{ store.config.description }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { store } from "../../store";
</script>
<style scoped lang="less"></style>
