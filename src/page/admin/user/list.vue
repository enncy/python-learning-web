<template>
  <div>
    <AdminTable
      entity-name="用户"
      @data-source-update="update"
      :admin-table-options="adminTableOptions"
    ></AdminTable>
  </div>
</template>
<script setup lang="ts">
import {
  AdminTableOptions,
  createDefaultColumnFactory,
} from "../../../utils/admin";
import AdminTable from "../../../components/common/AdminTable.vue";
import { User } from "../../../store/interface";

const adminTableOptions: AdminTableOptions<User> = {
  columns: [],
  dataSource: [],
  tableName: "user",
  hideColumns: ["version", "deleted", "id"],
  columnFactory: {
    role: {
      customRender: ({ value }) =>
        value === "admin" ? "管理员" : value === "user" ? "用户" : "游客",
    },
    ...createDefaultColumnFactory(),
  },
  page: 1,
  size: 10,
};

function update(users: User[]) {
  console.log("update", users);
}
</script>
<style scoped lang="less"></style>
