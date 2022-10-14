<template>
  <Card>
    <AdminTableVue
      entity-name="系统统计"
      v-model:table="table"
      :update="onUpdate"
      @pagination-change="onPaginationChange"
    ></AdminTableVue>
  </Card>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";

import AdminTableVue from "../../../components/common/AdminTable.vue";

import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import Card from "../../../components/common/Card.vue";
import dayjs from "dayjs";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "statistic_system",
    hideColumns: ["version", "deleted", "id"],
    columnFactory: {
      recordDate: {
        customRender: ({ value }) => dayjs(value).format("YYYY-MM-DD"),
        defaultSortOrder: "descend",
        sorter: (a: any, b: any) => a.recordDate - b.recordDate,
      },
      ...createDefaultColumnFactory(),
    },
    page: 1,
    size: 10,
  })
);

onBeforeMount(() => {
  table.value.init();
});

function onUpdate() {
  table.value.update();
}

function onPaginationChange(pagination: any) {
  table.value.page = pagination.current;
  table.value.size = pagination.pageSize;
  table.value.update();
}
</script>
<style scoped lang="less"></style>
