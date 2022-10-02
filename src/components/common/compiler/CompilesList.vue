<template>
  <div>
    <a-table
      :pagination="{
        pageSize: 5,
      }"
      :locale="{
        emptyText: '暂无数据',
      }"
      size="small"
      :dataSource="
        props.compiles.filter((c) => !!c.id).map((c) => ({ ...c, key: c.id }))
      "
      :columns="columns"
      :custom-row="
        (opts: any) => ({
          onClick:(e:any)=> onSelect(opts,e),
        })
      "
    >
      <template #bodyCell="data">
        <div v-if="data.index === status.index">
          <div class="selected-cell">
            <component
              :is="
                columns
                  .find((c) => c.key === data.column.key)
                  ?.customRender?.(data)
              "
            ></component>
          </div>
        </div>
      </template>
    </a-table>

    <div v-if="status.code">
      <span class="text-secondary"> 代码 : </span>
      <pre class="code dark" v-html="status.code"></pre>
      <span class="text-secondary"> 输入 : </span>
      <pre class="code">{{ status.input }}</pre>
      <span class="text-secondary"> 输出 : </span>
      <pre class="code">{{ status.output }}</pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import { TableColumnProps } from "ant-design-vue";
import { h, nextTick, onMounted, reactive, ref, watch } from "vue";
import { Compile } from "../../../store/interface";
import Icon from "../Icon.vue";

const props = defineProps<{
  compiles: Compile[];
}>();

const status = reactive({
  index: 0,
  code: "",
  input: "",
  output: "",
});

const customCell = () => ({
  style: {
    padding: "8px 0px",
    cursor: "pointer",
  },
});

const columns: TableColumnProps[] = [
  {
    title: "编译状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 100,
    customRender: ({ record }) => {
      const errorMessage = (record as any).errorMessage;
      return h(Icon, {
        type: errorMessage ? "icon-close-circle" : "icon-check-circle",
        style: {
          color: errorMessage ? "red" : "#52c41a",
        },
      });
    },
    customCell,
  },

  {
    title: "耗时",
    dataIndex: "timeConsuming",
    key: "timeConsuming",
    customRender: ({ text }) => h("span", `${text} m/s`),
    customCell,
  },
  {
    title: "执行时间",
    dataIndex: "createTime",
    key: "createTime",
    customRender: ({ value }) =>
      h("span", new Date(value).toLocaleString("zh-CN")),
    customCell,
  },
];

async function onSelect(opts: any, e: any) {
  status.index = props.compiles.findIndex((c) => c.id === opts.id);

  // @ts-ignore
  status.code = await monaco.editor.colorize(opts.codeContent, "python", {
    tabSize: 4,
  });
  status.output = opts.errorMessage || opts.output;
  status.input = opts.input;
}

// 初始化数据
onMounted(() => {
  nextTick(async () => {
    if (props.compiles[0].id) {
      // @ts-ignore
      status.code = await monaco.editor.colorize(
        props.compiles[0].codeContent,
        "python",
        {
          tabSize: 4,
        }
      );
      status.input = props.compiles[0].input;
      status.output =
        props.compiles[0].errorMessage || props.compiles[0].output || "";
    }
  });
});
</script>
<style scoped lang="less">
.compile {
  padding: 12px;
  border-bottom: 1px solid #e6e6e6;
}

.selected-cell {
  background-color: #dbf1ffa6;
}

.dark {
  background-color: #1e1e1e;
}
</style>
