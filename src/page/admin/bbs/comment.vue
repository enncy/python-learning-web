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
import { onBeforeMount, ref } from "vue";
import AdminTableVue from "../../../components/common/AdminTable.vue";

import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import Card from "../../../components/common/Card.vue";
import { max } from "../../../utils";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "bbs_comment",
    hideColumns: ["version", "deleted", "id"],
    columnFactory: {
      postTitle: {
        customRender: ({ value }) => max(value, 20),
      },
      content: {
        customRender: ({ value }) => max(value, 20),
      },
      parentContent: {
        customRender: ({ value }) => max(value, 20),
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
