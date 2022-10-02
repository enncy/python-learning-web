<template>
  <template v-if="entity.type === 'string'">
    <Input :schema="schema"></Input>
  </template>
  <template v-else-if="entity.type === 'number'">
    <InputNumber :schema="schema"></InputNumber>
  </template>
  <template v-else-if="entity.type === 'date'">
    <Input :schema="schema"></Input>
  </template>
  <template v-else-if="entity.type === 'object'">
    <JsonEditor
      :value="value"
      @change="(v:any)=>emits('update:value',v)"
    ></JsonEditor>
  </template>
  <template v-else>
    <div>未知的编辑器</div>
  </template>
</template>
<script setup lang="ts">
import { Schema } from "../../../store/interface";
import JsonEditor from "../JsonEditor.vue";
import Input from "./Input.vue";
import InputNumber from "./InputNumber.vue";

defineProps<{
  schema: Schema;
  entity: any;
  value: any;
}>();

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();
</script>
<style scoped lang="less"></style>
