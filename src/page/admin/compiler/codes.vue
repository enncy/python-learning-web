<template>
  <Card>
    <AdminTableVue
      entity-name="代码"
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
import { max } from "../../../utils";
import { maxRender } from "../../../utils/table";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "code",
    hideColumns: ["version", "deleted", "id", "userId"],
    columnFactory: {
      content: {
        customRender: maxRender,
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
