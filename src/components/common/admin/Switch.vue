<template>
  <span
    ><a-switch
      :checked="!!props.value"
      @change="(v:any)=>emits('update:value',v ? 1:0)"
      :disabled="schema.disabled"
  /></span>
</template>
<script setup lang="ts">
import { Schema } from "../../../store/interface";

const props = defineProps<{
  value: any;
  schema: Schema;
}>();

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();
</script>
<style scoped lang="less"></style>
