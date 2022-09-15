<template>
  <a-textarea
    :minlength="schema.min || 0"
    :maxlength="schema.max || 9999"
    :disabled="schema.disabled"
  ></a-textarea>
</template>
<script setup lang="ts">
import { Schema } from "../../../store/interface";

defineProps<{
  schema: Schema;
}>();
</script>
<style scoped lang="less"></style>
