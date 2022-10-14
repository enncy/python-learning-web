<template>
  <Card>
    <AdminTableVue
      entity-name="评论"
      v-model:table="table"
      :update="onUpdate"
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
import { booleanRender, maxRender } from "../../../utils/table";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "bbs_comment",
    hideColumns: ["version", "deleted", "id"],
    columnFactory: {
      postTitle: {
        customRender: maxRender,
      },
      content: {
        customRender: maxRender,
      },
      parentContent: {
        customRender: maxRender,
      },
      removed: { customRender: booleanRender },
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
