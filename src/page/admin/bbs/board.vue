<template>
  <Card>
    <AdminTableVue
      v-model:table="table"
      @create="onCreate"
      @modify="onModify"
    ></AdminTableVue>
  </Card>
</template>
<script setup lang="ts">
import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import AdminTableVue from "../../../components/common/AdminTable.vue";
import { onBeforeMount, ref } from "vue";
import Card from "../../../components/common/Card.vue";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "bbs_board",
    hideColumns: ["version", "deleted", "id"],
    columnFactory: {
      description: {
        ellipsis: true,
      },
      ...createDefaultColumnFactory(),
    },
    page: 1,
    size: 10,
  })
);

onBeforeMount(async () => {
  await table.value.init();
});

async function onCreate() {
  await table.value.update();
}
async function onModify() {
  await table.value.update();
}
</script>
<style scoped lang="less"></style>
