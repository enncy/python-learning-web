<template>
  <template v-if="entity.type === 'string'">
    <Input :schema="schema" :value="value" @change="onInputChange"></Input>
  </template>
  <template v-else-if="entity.type === 'number'">
    <InputNumber
      :schema="schema"
      :value="value"
      @change="onChange"
    ></InputNumber>
  </template>
  <template v-else-if="entity.type === 'date'">
    <a-date-picker show-time placeholder="选择时间" @change="onChange" />
  </template>
  <template v-else-if="entity.type === 'object'">
    <Card>
      <div class="mb-1">
        <span>模式</span>
        <a-divider type="vertical"></a-divider>
        <a-radio-group v-model:value="jsonEditorMode" size="small">
          <a-radio-button value="code">代码</a-radio-button>
          <a-radio-button value="text">文本</a-radio-button>
          <a-radio-button value="tree">树状</a-radio-button>
          <a-radio-button value="preview">只读</a-radio-button>
        </a-radio-group>
      </div>

      <JsonEditor
        :mode="jsonEditorMode"
        class="admin-json-editor"
        :value="value"
        @change="onChange"
      ></JsonEditor>
    </Card>
  </template>
  <template v-else>
    <Input :schema="schema" :value="value" @change="onInputChange"></Input>
  </template>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Schema } from "../../../store/interface";
import JsonEditor from "../JsonEditor.vue";
import Input from "./Input.vue";
import InputNumber from "./InputNumber.vue";
import Card from "../Card.vue";

const jsonEditorMode = ref("code");

defineProps<{
  schema: Schema;
  entity: any;
  value: any;
}>();

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();

function onInputChange(e: any) {
  emits("update:value", e.target.value);
}

function onChange(v: any) {
  emits("update:value", v);
}
</script>
<style scoped lang="less">
.admin-json-editor {
  height: 500px;
}
</style>
