<template>
  <Card>
    <AdminTableVue
      v-model:table="table"
      :entityFilter="entityFilter"
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
import { BBSCategory } from "../../../store/interface";
import { uploadResource } from "../../../api/resource";
import { maxRender } from "../../../utils/table";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "bbs_category",
    hideColumns: ["boardId", "version", "deleted", "id", "image"],
    extraColumns: [],
    columnFactory: {
      description: {
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

async function entityFilter(entity: BBSCategory) {
  if (entity.image) {
    await uploadResource({
      resource: entity.image,
      filename: entity.id,
      id: entity.id,
      folder: "image",
      invalid: false,
    });
  }

  return entity;
}
</script>
<style scoped lang="less"></style>
