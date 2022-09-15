<template>
  <a-select
    v-if="opts.length"
    :options="opts"
    defaultValue="用户"
    :disabled="schema.disabled"
  ></a-select>
</template>
<script setup lang="ts">
import { ref } from "vue";

import { Schema } from "../../../store/interface";

const props = defineProps<{
  schema: Schema;
}>();

const opts = ref<any[]>([]);

props.schema.options?.forEach((value, index) => {
  if (index % 2 === 0) {
    opts.value.push({ value });
  } else {
    opts.value[parseInt(String(index / 2))].label = value;
  }
});
</script>
<style scoped lang="less"></style>
