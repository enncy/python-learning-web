<template>
  <div v-if="adminTableOptions">
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
      <AdminTable
        v-if="props.schema.externalSchema"
        @data-source-update="onUpdate"
        @selected-entity="onSelect"
        :select-mode="true"
        :admin-table-options="adminTableOptions"
      ></AdminTable>
    </SimplifyModel>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { Schema } from "../../../store/interface";
import {
  AdminTableOptions,
  createDataSource,
  createDefaultColumnFactory,
} from "../../../utils/admin";
import AdminTable from "../AdminTable.vue";
import SimplifyModel from "../SimplifyModel.vue";

const object = Object;

const props = defineProps<{
  value: any;
  schema: Schema;
}>();

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();

const adminTableOptions = ref<AdminTableOptions<any>>();
const visible = ref(false);
const entity = ref();

/** 显示的值 */
const fieldDisplayValue = computed(() =>
  entity.value
    ? `${entity.value?.id} - ${
        entity.value?.[
          object.keys(entity.value).find((k) => k.includes("name")) || "id"
        ]
      }`
    : ""
);

onBeforeMount(async () => {
  if (props.schema.externalSchema) {
    const { records } = await createDataSource(
      props.schema.externalSchema,
      1,
      10
    );
    adminTableOptions.value = {
      columns: [],
      dataSource: records,
      hideColumns: ["version"],
      tableName: props.schema.externalSchema,
      columnFactory: {
        ...createDefaultColumnFactory(),
      },
      page: 1,
      size: 10,
    };

    // 初始化显示数据
    const _entity = records.find((d) => d.id === props.value);
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

function onUpdate(dataSource: any[]) {
  const _entity = dataSource.find((d) => d.id === props.value);
  if (_entity) {
    entity.value = _entity;
  }
}
</script>
<style scoped lang="less"></style>
