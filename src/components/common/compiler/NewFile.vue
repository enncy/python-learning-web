<template>
  <div class="new-file-model-item">
    <span>文件名 :</span>
    <a-input
      v-model:value="filename"
      class="w-50 float-end"
      size="small"
    ></a-input>
  </div>
  <div class="new-file-model-item">
    <span>文件模板: </span>
    <a-select
      v-model:value="template"
      class="w-50 float-end"
      size="small"
      :options="
        config.compiler.editor.templates.map((t) => ({
          value: t.name,
          label: t.name,
        }))
      "
    ></a-select>
  </div>
  <div class="new-file-model-item">
    <span>模板内容: </span>
    <pre class="code">{{ selectedTemplate?.content || "" }}</pre>
  </div>
  <div class="new-file-model-item">
    <a-button
      class="float-end"
      type="primary"
      @click="emits('create', filename, selectedTemplate?.content || '')"
    >
      创建
    </a-button>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { config } from "../../../store";

const filename = ref("新建文件");
const template = ref("数字求和");
const selectedTemplate = computed(() =>
  config.compiler.editor.templates.find((t) => t.name === template.value)
);

const emits = defineEmits<{
  (e: "create", filename: string, template: string): void;
}>();
</script>
<style scoped lang="less">
.new-file-model-item {
  min-height: 24px;
}

.new-file-model-item + .new-file-model-item {
  margin-top: 24px;
  clear: both;
}
</style>
