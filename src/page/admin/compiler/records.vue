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
    tableName: "compile_record",
    hideColumns: ["version", "deleted", "id", "codeId"],
    columnFactory: {
      codeContent: {
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
