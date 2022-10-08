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
      onChangeText(json: any) {
        emits("change", json);
      },
    };

    // https://github.com/josdejong/jsoneditor/tree/master/docs/api.md
    // @ts-ignore
    const editor = new JSONEditor(jsonEditor.value, options);

    if (props.value) {
      editor.set(JSON.parse(props.value));
    } else {
      editor.set({});
    }
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
