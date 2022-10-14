<template>
  <Card>
    <AdminTableVue
      entity-name="用户通知"
      v-model:table="table"
      :update="onUpdate"
      @pagination-change="onPaginationChange"
    ></AdminTableVue>
  </Card>
</template>
<script setup lang="ts">
import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import AdminTableVue from "../../../components/common/AdminTable.vue";

import { onBeforeMount, ref } from "vue";
import Card from "../../../components/common/Card.vue";
import { getRole } from "../../../utils";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "user_notify",
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
