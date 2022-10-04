<template>
  <div ref="jsonEditor"></div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";

const jsonEditor = ref();

const props = defineProps<{
  value: string;
  mode: string;
}>();

const emits = defineEmits<{
  (e: "change", value: string): void;
}>();

onMounted(() => {
  nextTick(() => {
    // https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options

    const options = {
      onChangeJSON(json: any) {
        emits("change", JSON.stringify(json, null, 4));
      },
    };

    // https://github.com/josdejong/jsoneditor/tree/master/docs/api.md
    // @ts-ignore
    const editor = new JSONEditor(jsonEditor.value, options);

    editor.set(JSON.parse(props.value));
    editor.setMode(props.mode);

    watch(
      () => props.mode,
      () => {
        editor.setMode(props.mode);
      }
    );
  });
});
</script>
<style scoped lang="less"></style>
