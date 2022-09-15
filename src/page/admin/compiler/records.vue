<template>
  <AdminTable :admin-table-options="adminTableOptions"></AdminTable>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  AdminTableOptions,
  createDefaultColumnFactory,
} from "../../../utils/admin";
import AdminTable from "../../../components/common/AdminTable.vue";
import { BBSBoard } from "../../../store/interface";

const adminTableOptions: AdminTableOptions<BBSBoard> = {
  columns: [],
  dataSource: [],
  tableName: "compile_record",
  hideColumns: ["version", "deleted", "id"],
  columnFactory: {
    ...createDefaultColumnFactory(),
  },
  page: 1,
  size: 10,
};
</script>
<style scoped lang="less"></style>
