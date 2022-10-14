<template>
  <Card>
    <AdminTableVue
      entity-name="系统资源"
      v-model:table="table"
      :custom-request="customRequest"
      :update="onUpdate"
      @pagination-change="onPaginationChange"
    ></AdminTableVue>
  </Card>
</template>
<script setup lang="tsx">
import { ref, onBeforeMount, h } from "vue";
import AdminTableVue from "../../../components/common/AdminTable.vue";
import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import Card from "../../../components/common/Card.vue";
import { SystemResource } from "../../../store/interface";
import { ResourceApi } from "../../../api";
import { message } from "ant-design-vue";
import { size } from "../../../utils";
import ResourcePreviewVue from "../../../components/common/ResourcePreview.vue";
import { uploadResource } from "../../../api/resource";
import { booleanRender } from "../../../utils/table";

const table = ref(
  new AdminTable({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "system_resource",
    hideColumns: ["version", "deleted", "id", "resource", "absolutePath"],
    extraColumns: [
      {
        dataIndex: "preview",
        key: "preview",
        title: "预览",
        width: 300,
      },
      {
        dataIndex: "link",
        key: "link",
        title: "链接",
      },
    ],
    columnFactory: {
      preview: {
        level: 100,

        customRender: ({ record }: any) => (
          <div class="d-flex" style="width: 360px">
            <ResourcePreviewVue
              type={record.type}
              src={ResourceApi.of({ id: record.id })}
            ></ResourcePreviewVue>
          </div>
        ),
      },
      link: {
        level: 99,
        customRender: ({ record }: any) => (
          <div>
            <div>
              <span> /resource?id={record.id} </span>
              <a
                class="ms-3"
                onClick={() => copy(ResourceApi.of({ id: record.id }))}
              >
                复制
              </a>
            </div>
            <div>
              <span> /resource?filename={record.filename} </span>
              <a
                class="ms-3"
                onClick={() =>
                  copy(ResourceApi.of({ filename: record.filename }))
                }
              >
                复制
              </a>
            </div>
          </div>
        ),
      },
      size: {
        customRender: ({ value }) => size(value),
      },
      invalid: {
        customRender: booleanRender,
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

async function customRequest(
  entity: SystemResource,
  mode: "create" | "update" | "remove"
) {
  if (mode === "remove") {
    const {
      data: { data, msg },
    } = await ResourceApi.remove(entity.id);
    if (data) {
      message.success(msg);
      table.value.update();
      return true;
    } else {
      message.error(msg);
      return false;
    }
  } else {
    const finished = await uploadResource(entity);
    if (finished) {
      table.value.update();
    }
    return finished;
  }
}

function onPaginationChange(pagination: any) {
  table.value.page = pagination.current;
  table.value.size = pagination.pageSize;
  table.value.update();
}

function copy(text: string) {
  navigator.clipboard.writeText(text);
  message.success("复制成功");
}
</script>
<style scoped lang="less"></style>
