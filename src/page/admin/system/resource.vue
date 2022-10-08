<template>
  <Card>
    <AdminTableVue
      v-model:table="table"
      :before-request="onBeforeRequest"
      @create="onCreate"
      @modify="onModify"
      @pagination-change="onPaginationChange"
    ></AdminTableVue>
  </Card>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, h } from "vue";

import AdminTableVue from "../../../components/common/AdminTable.vue";

import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import Card from "../../../components/common/Card.vue";

import { SystemResource } from "../../../store/interface";
import { ResourceApi } from "../../../api";
import { message } from "ant-design-vue";
import { config } from "../../../store";
import ResourcePreviewVue from "../../../components/common/ResourcePreview.vue";

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

        customRender: ({ record }) =>
          h(
            "div",
            {
              class: "d-flex",
              style: {
                width: "300px",
              },
            },
            [
              // @ts-ignore

              h(ResourcePreviewVue, {
                // @ts-ignore
                type: record.type,
                // @ts-ignore
                src: ResourceApi.of({ id: record.id }),
              }),
            ]
          ),
      },
      link: {
        level: 99,
        customRender: ({ record }) =>
          h("div", [
            h("div", [
              // @ts-ignore
              h("span", `/resource?id=${record.id}`),
              h(
                "a",
                {
                  class: "ms-3",
                  onClick: () => {
                    navigator.clipboard.writeText(
                      // @ts-ignore
                      ResourceApi.of({ id: record.id })
                    );
                    message.success("复制成功");
                  },
                },
                "复制"
              ),
            ]),

            h("div", [
              h(
                "span",
                // @ts-ignore
                `/resource?filename=${record.filename}`
              ),
              h(
                "a",
                {
                  class: "ms-3",
                  onClick: () => {
                    navigator.clipboard.writeText(
                      // @ts-ignore
                      ResourceApi.of({ filename: record.filename })
                    );
                    message.success("复制成功");
                  },
                },
                "复制"
              ),
            ]),
          ]),
      },
      size: {
        customRender: ({ value }) => size(value),
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

function onCreate(entity: any) {
  table.value.update();
}
function onModify() {
  table.value.update();
}

async function onBeforeRequest(
  entity: SystemResource,
  mode: "create" | "update" | "remove"
) {
  if (mode === "remove") {
    const {
      data: { data, msg },
    } = await ResourceApi.remove(entity.id);
    data ? message.success(msg) : message.error(msg);
  } else {
    const {
      data: { data, msg },
    } = await ResourceApi.upload(entity);
    data ? message.success(msg) : message.error(msg);
  }
  table.value.update();
  return false;
}

function onPaginationChange(pagination: any) {
  table.value.page = pagination.current;
  table.value.size = pagination.pageSize;
  table.value.update();
}

function size(num: number) {
  return (
    (
      [
        ["GB", Math.pow(1024, 3)],
        ["MB", Math.pow(1024, 2)],
        ["KB", Math.pow(1024, 1)],
        ["B", 1],
      ] as [string, number][]
    )
      .map((i) => [i[0], Math.floor(num / i[1])])
      .find((i) => i[1] > 0)
      // @ts-ignore
      ?.reduce((pre, cur) => cur + pre)
  );
}
</script>
<style scoped lang="less"></style>
