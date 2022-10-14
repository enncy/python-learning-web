<template>
  <SimplifyModel>
    <template v-for="schema of schemas">
      <template v-if="schema.hideInTable === false">
        <div>{{ schema.label }} :</div>
        <div class="w-100 mb-3">
          <component
            class="w-100"
            :is="
              componentMapping.find((c) => c.type === schema.type)?.component ||
              null
            "
            v-model:entity="entity"
            :schema="schema"
            v-model:value="(entity as any)[schema.name]"
          ></component>
        </div>
      </template>
    </template>

    <div class="d-flex justify-content-end">
      <slot></slot>
    </div>
  </SimplifyModel>
</template>
<script setup lang="ts">
import { Schema } from "../../store/interface";
import Input from "./admin/Input.vue";
import InputNumber from "./admin/InputNumber.vue";
import Select from "./admin/Select.vue";
import Switch from "./admin/Switch.vue";
import Textarea from "./admin/Textarea.vue";
import ExternalSelect from "./admin/ExternalSelect.vue";
import AdminMarkdown from "./admin/AdminMarkdown.vue";
import SystemConfigInput from "./admin/SystemConfigInput.vue";
import DateSelector from "./admin/DateSelector.vue";
import Resource from "./admin/Resource.vue";
import SimplifyModel from "./SimplifyModel.vue";

defineProps<{
  entity: any;
  schemas: Schema[];
}>();

const componentMapping = [
  {
    type: "text",
    component: Input,
  },
  {
    type: "number",
    component: InputNumber,
  },
  {
    type: "textarea",
    component: Textarea,
  },
  {
    type: "switch",
    component: Switch,
  },
  {
    type: "select",
    component: Select,
  },
  {
    type: "date",
    component: DateSelector,
  },
  {
    type: "external-select",
    component: ExternalSelect,
  },
  {
    type: "markdown",
    component: AdminMarkdown,
  },
  {
    type: "system-config-input",
    component: SystemConfigInput,
  },

  {
    type: "resource",
    component: Resource,
  },
];
</script>
<style scoped lang="less"></style>
