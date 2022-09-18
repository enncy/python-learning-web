<template>
  <div v-if="table">
    <div>
      <a-input-group class="d-flex" compact>
        <a-input
          v-show="false"
          disabled
          v-model:value="value"
          placeholder="点击右侧选择ID"
        ></a-input>
        <a-input
          disabled
          :value="fieldDisplayValue"
          placeholder="点击右侧选择ID"
        ></a-input>

        <a-button type="primary" @click="visible = true">选择数据</a-button>
      </a-input-group>
    </div>

    <SimplifyModel :width="1000" v-model:visible="visible">
      <AdminTableVue
        @selected-entity="onSelect"
        :select-mode="true"
        :table="table"
        @create="onCreate"
        @modify="onModify"
      ></AdminTableVue>
    </SimplifyModel>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { Schema } from "../../../store/interface";
import {
  AdminTable,
  AdminTableOptions,
  createDefaultColumnFactory,
} from "../../../utils/admin";
import AdminTableVue from "../AdminTable.vue";
import SimplifyModel from "../SimplifyModel.vue";

const object = Object;

const props = defineProps<{
  value: any;
  schema: Schema;
}>();

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();

const visible = ref(false);
const entity = ref();
const table = ref<AdminTable<any>>();

/** 显示的值 */
const fieldDisplayValue = computed(() =>
  entity.value && table.value
    ? table.value.schemas
        .filter((s) => s.showInSearch)
        .map((s) => `${s.label}=${entity.value[s.name]}`)
        .join(", ")
    : ""
);

onBeforeMount(async () => {
  if (props.schema.externalSchema) {
    table.value = new AdminTable({
      schemas: [],
      columns: [],
      dataSource: [],
      columnsFilter: (col, schemas) =>
        !!schemas.find((s) => s.name === col.dataIndex)?.showInSearch,
      hideColumns: ["version", "deleted"],
      tableName: props.schema.externalSchema,
      columnFactory: {
        ...createDefaultColumnFactory(),
      },
      page: 1,
      size: 10,
    });

    await table.value.init();

    // 初始化显示数据
    const _entity = table.value.dataSource.find((d) => d.id === props.value);
    if (_entity) {
      entity.value = _entity;
    }
  }
});

function onSelect(_entity: any) {
  visible.value = false;
  emits("update:value", _entity.id);
  entity.value = _entity;
}

async function onCreate() {
  await table.value?.update();
}
async function onModify() {
  await table.value?.update();
}
</script>
<style scoped lang="less"></style>
