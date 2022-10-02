<template>
  <div ref="jsonEditor"></div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";

const jsonEditor = ref();

const props = defineProps<{
  value: string;
}>();

const emits = defineEmits<{
  (e: "change", value: string): void;
}>();

onMounted(() => {
  nextTick(() => {
    const options = {
      onChangeJSON(json: any) {
        emits("change", JSON.stringify(json, null, 4));
      },
    };

    // @ts-ignore
    const editor = new JSONEditor(jsonEditor.value, options);

    editor.set(JSON.parse(props.value));
  });
});
</script>
<style scoped lang="less"></style>
