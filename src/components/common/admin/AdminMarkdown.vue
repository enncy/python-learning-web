<template>
  <MarkdownEditor
    :content="value || ''"
    @update:content="(c) => emits('update:value', c)"
  ></MarkdownEditor>
</template>
<script setup lang="ts">
import MarkdownEditor from "../MarkdownEditor.vue";

defineProps<{
  value: any;
}>();

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();
</script>
<style scoped lang="less"></style>
