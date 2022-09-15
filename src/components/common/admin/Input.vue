<template>
  <a-input
    :minlength="schema.min || 0"
    :maxlength="schema.max || 99"
    :disabled="schema.disabled"
  ></a-input>
</template>
<script setup lang="ts">
import { Schema } from "../../../store/interface";

defineProps<{
  schema: Schema;
}>();
</script>
<style scoped lang="less"></style>
