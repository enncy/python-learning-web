<template>
  <Card>
    <AdminTableVue
      v-model:table="table"
      @create="onCreate"
      @modify="onModify"
      @pagination-change="onPaginationChange"
    ></AdminTableVue>
  </Card>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";

import AdminTableVue from "../../../components/common/AdminTable.vue";

import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import Card from "../../../components/common/Card.vue";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "system_config",
    hideColumns: ["version", "deleted", "id"],
    columnFactory: {
      ...createDefaultColumnFactory(),
    },
    page: 1,
    size: 10,
  })
);

onBeforeMount(() => {
  table.value.init();
});

function onCreate() {
  table.value.update();
}
function onModify() {
  table.value.update();
}

function onPaginationChange(pagination: any) {
  table.value.page = pagination.current;
  table.value.size = pagination.pageSize;
  table.value.update();
}
</script>
<style scoped lang="less"></style>
