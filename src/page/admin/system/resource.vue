<template>
  <Card>
    <AdminTableVue
      v-model:table="table"
      :custom-request="customRequest"
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
import ResourcePreviewVue from "../../../components/common/ResourcePreview.vue";
import { size } from "../../../utils";

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
                width: "360px",
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
    // 初始化资源
    await ResourceApi.init(entity);
    // 上传资源
    const finished = await ResourceApi.upload(entity.id, entity.resource);
    if (finished) {
      message.success("上传成功");
      table.value.update();
      return true;
    } else {
      // 删除被中断的资源文件
      await ResourceApi.remove(entity.id);
      message.warn("已暂停上传");

      return false;
    }
  }
}

function onPaginationChange(pagination: any) {
  table.value.page = pagination.current;
  table.value.size = pagination.pageSize;
  table.value.update();
}
</script>
<style scoped lang="less"></style>
