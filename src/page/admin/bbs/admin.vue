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
import { onBeforeMount, ref } from "vue";
import AdminTableVue from "../../../components/common/AdminTable.vue";
import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import Card from "../../../components/common/Card.vue";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "bbs_admin",
    hideColumns: ["version", "deleted", "id", "userId", "categoryId"],
    columnFactory: {
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
