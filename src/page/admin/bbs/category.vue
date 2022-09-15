<template>
  <AdminTable :admin-table-options="adminTableOptions"></AdminTable>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";

import { BBSBoard } from "../../../store/interface";
import {
  AdminTableOptions,
  createDefaultColumnFactory,
} from "../../../utils/admin";
import AdminTable from "../../../components/common/AdminTable.vue";
import { AdminApi } from "../../../api";
import { h, ref } from "vue";

const adminTableOptions: AdminTableOptions<BBSBoard> = {
  columns: [],
  dataSource: [],
  tableName: "bbs_category",
  hideColumns: ["boardId", "version", "deleted", "id"],
  extraColumns: [],
  columnFactory: {
    ...createDefaultColumnFactory(),
  },
  page: 1,
  size: 10,
};
</script>
<style scoped lang="less"></style>
