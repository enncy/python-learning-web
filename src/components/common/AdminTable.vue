<template>
  <template v-if="loading">
    <div>
      <div class="mb-3 d-flex">
        <div
          class="d-flex"
          v-if="table.schemas.filter((s) => s.searchable).length"
        >
          <template v-for="schema of table.schemas.filter((s) => s.searchable)">
            <a-input-search
              class="schema-search"
              style="width: 200px"
              :placeholder="`输入${schema.label}搜索`"
              enter-button
              @search="(v:any)=>onSearch(v,schema)"
            />
          </template>
          <a-button type="link" @click="searchedDataSource = []">
            重置
          </a-button>
        </div>
        <div v-if="selectMode === false">
          <a-button type="primary" @click="state.model.create = true">
            <Icon type="icon-plus" />
            添加{{ entityName }}
          </a-button>
        </div>
        <div style="clear: both"></div>
      </div>

      <a-table
        :scroll="{ x: 1200 }"
        :pagination="{
          pageSize: 10,
        }"
        :locale="{
          emptyText: '暂无数据',
        }"
        :row-selection="selectMode === true ? rowSelection : {}"
        size="small"
        :dataSource="
          (searchedDataSource.length
            ? searchedDataSource
            : table.dataSource
          ).map((d, index) => ({ key: index, ...d }))
        "
        :columns="cols"
      >
        <template #bodyCell="{ text, column, record, index }">
          <template v-if="column.dataIndex === 'actions'">
            <div>
              <a-button
                type="link"
                size="small"
                @click="(currentEntity = record), (state.model.details = true)"
              >
                详情
              </a-button>
              <a-button
                type="link"
                size="small"
                @click="(currentEntity = record), (state.model.modify = true)"
              >
                修改
              </a-button>
              <a-popconfirm
                :title="`是否删除此${entityName}?`"
                ok-text="确定"
                cancel-text="取消"
                @confirm="removeEntity(index)"
              >
                <a-button type="link" danger size="small"> 删除 </a-button>
              </a-popconfirm>
            </div>
          </template>
          <template v-else-if="text === undefined"> --- </template>
        </template>
      </a-table>

      <template v-if="selectMode">
        <div class="d-flex justify-content-end">
          <a-button
            type="primary"
            :disabled="selectedEntity === undefined"
            @click="emits('selectedEntity', selectedEntity)"
          >
            选择
          </a-button>
        </div>
      </template>

      <AdminEntityModel
        :width="600"
        :schemas="table.schemas"
        :title="'添加' + entityName"
        v-model:visible="state.model.create"
        v-model:entity="formData"
      >
        <a-button class="me-3" @click="state.model.create = false">
          取消
        </a-button>
        <a-button type="primary" @click="createEntity">添加</a-button>
      </AdminEntityModel>

      <AdminEntityModel
        :width="600"
        :title="'修改' + entityName"
        :schemas="table.schemas"
        v-model:visible="state.model.modify"
        v-model:entity="currentEntity"
      >
        <a-button class="me-3" @click="state.model.modify = false">
          取消
        </a-button>
        <a-button type="primary" @click="updateEntity">修改</a-button>
      </AdminEntityModel>

      <SimplifyModel
        v-model:visible="state.model.details"
        :title="entityName + '详情'"
      >
        <table>
          <template v-for="schema of table.schemas">
            <tr>
              <td class="text-nowrap fw-bold d-flex pe-3">
                {{ schema.label }}
              </td>
              <td>
                {{
                  table.columns
                    .find((c) => c.dataIndex === schema.name)
                    ?.customRender?.({
                      value: (currentEntity as any)[schema.name],
                    } as any) ||
                  (currentEntity as any)[schema.name] ||
                  "无"
                }}
              </td>
            </tr>
          </template>
        </table>
      </SimplifyModel>
    </div>
  </template>

  <template v-else>
    <a-skeleton active></a-skeleton>
  </template>
</template>
<script setup lang="ts">
import { message, TableColumnProps, TableProps } from "ant-design-vue";
import {
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  computed,
  onBeforeMount,
} from "vue";
import { AdminTable, AdminTableOptions } from "../../utils/admin";
import Icon from "./Icon.vue";
import SimplifyModel from "./SimplifyModel.vue";

import { AdminApi } from "../../api";
import { Schema } from "../../store/interface";
import AdminEntityModel from "./AdminEntityModel.vue";

const emits = defineEmits<{
  (e: "dataSourceUpdate", dataSource: any[]): void;
  (e: "selectedEntity", entity: any): void;
}>();
const props = withDefaults(
  defineProps<{
    /** 选择模式 */
    selectMode?: boolean;
    entityName?: string;
    adminTableOptions: AdminTableOptions<any>;
  }>(),
  {
    entityName: "数据",
    readonly: false,
  }
);

// 数据是否加载中
const loading = ref(true);
// 实体名
const { entityName } = toRefs(props);
// 表格对象
const table = reactive(new AdminTable(props.adminTableOptions));
// 搜索到的临时数据
const searchedDataSource = ref<any[]>([]);
// 添加实体的表单数据
const formData = reactive({} as any);
// 当前的实体
const currentEntity = ref();
// 选中的实体
const selectedEntity = ref();

// 额外列表
const extraColumns: TableColumnProps[] = [
  {
    dataIndex: "actions",
    title: "操作",
    fixed: "right",
  },
];

const cols = computed(() =>
  table.columns
    .concat(props.selectMode === true ? [] : extraColumns)
    .map((c) => ({ key: c.dataIndex, ...c }))
);

const state = reactive({
  model: {
    create: false,
    details: false,
    modify: false,
  },
});

const rowSelection: TableProps["rowSelection"] = {
  hideSelectAll: true,
  type: "radio",
  onChange: (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
    const selected = selectedRows.find((r) => r.key === selectedRowKeys[0]);

    if (selected) {
      selectedEntity.value = selected;
    }
  },
};

watch(
  () => table.dataSource,
  (data) => {
    emits("dataSourceUpdate", data);
  }
);
onBeforeMount(async () => {
  await table.initColumns();

  if (table.dataSource.length === 0) {
    await table.update();

    // 触发一次数据更新
    emits("dataSourceUpdate", table.dataSource);
  }

  // 生成表单数据
  table.schemas.reduce((prev, curr) => {
    prev[curr.name as any] = undefined;
    return prev;
  }, formData as any);
});

function onSearch(value: string, schema: Schema) {
  const wrapper: any = {
    tableName: table.tableName,
    page: 1,
    size: 10,
  };
  wrapper[schema.name] = value;
  AdminApi.search(wrapper).then(({ data: { data } }) => {
    searchedDataSource.value = data.records;
  });
}

function removeEntity(index: number) {
  AdminApi.remove({
    tableName: table.tableName,
    ...(table.dataSource[index] as any),
  }).then(({ data: { data, msg } }) => {
    if (data) {
      message.success(msg);
      table.dataSource.splice(index, 1);
    } else {
      message.error(msg);
    }
  });
}

function updateEntity() {
  AdminApi.update({
    tableName: table.tableName,
    ...(currentEntity.value as any),
  }).then(({ data: { data, msg } }) => {
    if (data) {
      message.success(msg);
      const index = table.dataSource.findIndex(
        (d) => d.id === currentEntity.value.id
      );
      table.dataSource[index] = currentEntity.value;
    } else {
      message.error(msg);
    }
  });
}

function createEntity() {
  AdminApi.create({
    tableName: table.tableName,
    ...formData,
  }).then(({ data: { data, msg } }) => {
    if (data) {
      message.success(msg);
      state.model.create = false;
    } else {
      message.error(msg);
    }
  });
}
</script>
<style scoped lang="less">
.schema-search + .schema-search {
  margin-left: 12px;
}
</style>
