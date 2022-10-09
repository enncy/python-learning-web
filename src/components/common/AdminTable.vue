<template>
  <Transition name="fade" mode="out-in">
    <a-skeleton active v-if="table.loading"></a-skeleton>

    <div v-else>
      <div class="mb-3 d-flex">
        <div
          class="d-flex"
          v-if="
            hideSearch !== true &&
            table.schemas.filter((s) => s.searchable).length
          "
        >
          <template v-for="schema of table.schemas.filter((s) => s.searchable)">
            <template v-if="schema.options?.length">
              <a-select
                value="选择文件类型"
                class="schema-search"
                @change="(v:any)=>onSearch(v,schema)"
              >
                <a-select-option
                  v-for="(option,index) of schema.options.reduce((pre, cur, i) => {
                    const num = Math.floor(i / 2)
                    // @ts-ignore
                    pre[num] =  i % 2 === 0 ? [cur] : [pre[num][0], cur];
                    return pre;
                  }, [] as any[])"
                  :key="option[0]"
                  :value="option[0]"
                ></a-select-option>
              </a-select>
            </template>
            <template v-else>
              <a-input-search
                class="schema-search"
                :placeholder="`${schema.label}`"
                enter-button
                @search="(v:any)=>onSearch(v,schema)"
              />
            </template>
          </template>
          <a-button
            type="link"
            @click="(searchedDataSource = []), (searching = false)"
          >
            重置
          </a-button>
        </div>
        <div v-if="selectMode === false">
          <a-button
            type="primary"
            @click="(state.model.create = true), (formData.id = uuid())"
          >
            <Icon type="icon-plus" />
            添加{{ entityName }}
          </a-button>
        </div>
        <div style="clear: both"></div>
      </div>

      <a-table
        :scroll="{ x: true }"
        :pagination="pagination"
        @change="onChange"
        :custom-row="
          () => ({
            class: 'text-nowrap',
          })
        "
        :custom-header-row="
          () => ({
            class: 'text-nowrap',
          })
        "
        :locale="{
          emptyText: '暂无数据',
        }"
        :row-selection="selectMode === true ? rowSelection : {}"
        size="small"
        :dataSource="
          (searching ? searchedDataSource : table.dataSource).map(
            (entity, index) => ({
              key: entity.id,
              ...entity,
            })
          )
        "
        :columns="cols"
      >
        <template #bodyCell="{ text, value, column, record, index }">
          <template v-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button
                type="primary"
                size="small"
                ghost
                @click="(currentEntity = record), (state.model.details = true)"
              >
                详情
              </a-button>
              <a-button
                type="primary"
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
                <a-button type="primary" danger size="small"> 删除 </a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else-if="column.customRender">
            <component
              :is="
                resolveCustomRender(
                  column.customRender({ text, value, column, record, index })
                )
              "
            ></component>
          </template>
          <template v-else-if="text === undefined || text === ''">
            ---
          </template>
        </template>
      </a-table>

      <template v-if="selectMode">
        <div class="d-flex justify-content-end mt-3">
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
        :width="1000"
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
        :width="1000"
        :title="'修改' + entityName"
        :schemas="table.schemas"
        v-model:visible="state.model.modify"
        v-model:entity="currentEntity"
      >
        <a-button class="me-3" @click="state.model.modify = false">
          取消
        </a-button>
        <a-button type="primary" @click="modifyEntity">修改</a-button>
      </AdminEntityModel>

      <SimplifyModel
        :width="1000"
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
                <component
                  :is="resolveCustomRender(table.columns
                    .find((c) => c.dataIndex === schema.name)
                    ?.customRender?.({
                      value: (currentEntity as any)[schema.name],
                      record: currentEntity
                    } as any) ||
                  (currentEntity as any)[schema.name] ||
                  '无')"
                ></component>
              </td>
            </tr>
          </template>
        </table>
      </SimplifyModel>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { message, TableColumnProps, TableProps } from "ant-design-vue";
import {
  reactive,
  ref,
  toRefs,
  computed,
  onBeforeMount,
  isVNode,
  h,
  watch,
} from "vue";
import { AdminTable, AdminTableOptions } from "../../utils/admin";
import Icon from "./Icon.vue";
import SimplifyModel from "./SimplifyModel.vue";

import { AdminApi } from "../../api";
import { Schema } from "../../store/interface";
import AdminEntityModel from "./AdminEntityModel.vue";
import { uuid } from "../../utils";
import { AxiosRequestConfig } from "axios";

const emits = defineEmits<{
  (e: "update:table", table: AdminTable<any>): void;
  (e: "create", entity: any): void;
  (e: "modify", entity: any): void;
  (e: "remove", entity: any): void;
  (e: "selectedEntity", entity: any): void;
  (e: "paginationChange", pagination: any): void;
}>();
const props = withDefaults(
  defineProps<{
    hideSearch?: boolean;
    /** 选择模式 */
    selectMode?: boolean;
    entityName?: string;
    table: AdminTableOptions<any>;
    /** 自定义请求方式 */
    customRequest?: (
      entity: any,
      mode: "create" | "remove" | "update",
      callback?: (entity: any) => void
    ) => boolean | Promise<boolean>;
    entityFilter?: (entity: any) => any;
  }>(),
  {
    entityName: "数据",
    readonly: false,
  }
);

const { selectMode, entityName, table } = toRefs(props);

// 搜索到的临时数据
const searchedDataSource = ref<any[]>([]);
// 是否正在搜索
const searching = ref(false);

// 添加实体的表单数据
/**
 * 如果是新建数据，则初始化随机ID.
 * 这里不使用后端自动生成的ID是因为可能有其他资源需要绑定ID，例如图片上传
 */
const formData = reactive({
  id: uuid(),
});
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
    width: 200,
  },
];

const cols = computed(() =>
  table.value.columns
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

const pagination = reactive({
  current: table.value.page,
  pageSize: table.value.size,
  total: 10,
  position: ["bottomCenter"],
  pageSizeOptions: ["10", "20", "50", "100"],
  showSizeChanger: true,
  showTotal: (total: number, range: any[]) =>
    `显示 ${range[0]}-${range[1]} , 总共 ${total} 个数据`,
});

watch(
  () => table.value.total,
  () => {
    pagination.total = table.value.total || pagination.total;
  }
);

watch(
  () => [pagination.current, pagination.pageSize],
  () => {
    emits("paginationChange", pagination);
  }
);

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

onBeforeMount(async () => {
  // 生成表单数据
  table.value.schemas.reduce((prev, curr) => {
    prev[curr.name as any] = undefined;
    return prev;
  }, formData as any);
});

function onSearch(value: string, schema: Schema) {
  const wrapper: any = {
    tableName: table.value.tableName,

    page: 1,
    size: 10,
  };
  wrapper[schema.name] = value;
  AdminApi.search(wrapper).then(({ data: { data } }) => {
    searchedDataSource.value = data;
    searching.value = true;
  });
}

async function removeEntity(index: number) {
  const entity = props.entityFilter
    ? props.entityFilter(table.value.dataSource[index])
    : table.value.dataSource[index];
  if (props.customRequest) {
    await props.customRequest(
      entity,
      "remove",
      (ent) => (table.value.dataSource[index] = ent)
    );
  } else {
    AdminApi.remove(table.value.tableName, entity).then(
      ({ data: { data, msg } }) => {
        if (data) {
          message.success(msg);
          table.value.dataSource.splice(index, 1);
        } else {
          message.error(msg);
        }
      }
    );
  }
}

async function modifyEntity() {
  const entity = props.entityFilter
    ? props.entityFilter(currentEntity.value)
    : currentEntity.value;

  if (props.customRequest) {
    const pass = await props.customRequest(
      entity,
      "update",
      (ent) => (currentEntity.value = ent)
    );
    state.model.modify = !pass;
  } else {
    AdminApi.update(table.value.tableName, entity).then(
      async ({ data: { data, msg } }) => {
        if (data) {
          emits("modify", entity);
          state.model.modify = false;
          message.success(msg);
        } else {
          message.error(msg);
        }
      }
    );
  }
}

async function createEntity() {
  const entity = props.entityFilter ? props.entityFilter(formData) : formData;
  if (props.customRequest) {
    const pass = await props.customRequest(entity, "create", (ent) =>
      Object.assign(formData, ent)
    );
    state.model.create = !pass;
  } else {
    AdminApi.create(table.value.tableName, entity).then(
      async ({ data: { data, msg } }) => {
        if (data) {
          emits("create", entity);
          state.model.create = false;
          message.success(msg);
        } else {
          message.error(msg);
        }
      }
    );
  }
}

function resolveCustomRender(node: any) {
  if (isVNode(node)) {
    return node;
  } else {
    return h("span", node);
  }
}

function onChange(pag: any) {
  Object.assign(pagination, pag);
}
</script>
<style scoped lang="less">
.schema-search + .schema-search {
  margin-left: 12px;
}

.schema-search {
  width: 200px;
}
</style>
