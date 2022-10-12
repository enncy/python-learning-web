<template>
  <div>
    <Card class="mb-3" title="高级搜索">
      <div class="row m-0" style="gap: 12px">
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-input
            addonBefore="用户名"
            v-model:value="search.username"
          ></a-input>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-input
            addonBefore="用户昵称"
            v-model:value="search.nickname"
          ></a-input>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-input
            addonBefore="所属版块名"
            v-model:value="search.boardName"
          ></a-input>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-input
            addonBefore="所属分区名"
            v-model:value="search.categoryName"
          ></a-input>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-input
            addonBefore="文章标题"
            v-model:value="search.title"
          ></a-input>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-input
            addonBefore="文章内容"
            v-model:value="search.content"
          ></a-input>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-switch
            checked-children="精华"
            un-checked-children="精华"
            v-model:checked="search.recommend"
          ></a-switch>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-switch
            checked-children="封禁"
            un-checked-children="封禁"
            v-model:checked="search.banned"
          ></a-switch>
        </div>
        <div class="col-12 col-md-4 col-lg-3 search-item">
          <a-switch
            checked-children="已删除"
            un-checked-children="已删除"
            v-model:checked="search.removed"
          ></a-switch>
        </div>

        <div class="col-12 col-md-4 col-lg-3">
          <a-space>
            <a-button type="primary" @click="advanceSearch"> 搜索 </a-button>
            <a-button type="primary" ghost @click="reset"> 重置 </a-button>
          </a-space>
        </div>
      </div>
    </Card>

    <Card>
      <AdminTableVue
        :hide-search="true"
        v-model:table="table"
        @create="onCreate"
        @modify="onModify"
        @pagination-change="onPaginationChange"
      ></AdminTableVue>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { h, onBeforeMount, reactive, ref } from "vue";
import AdminTableVue from "../../../components/common/AdminTable.vue";
import { AdminTable, createDefaultColumnFactory } from "../../../utils/admin";
import Card from "../../../components/common/Card.vue";
import { BBSApi } from "../../../api";
import { BBSPost, BBSPostModel } from "../../../store/interface";
import { max } from "../../../utils";

const search = reactive({
  username: "",
  nickname: "",
  boardName: "",
  categoryName: "",
  title: "",
  content: "",
  recommend: false,
  banned: false,
  removed: false,
});

const searchResult = ref<BBSPost[]>([]);
const originDataSource = ref<BBSPost[]>([]);

const table = ref(
  new AdminTable<BBSPost>({
    schemas: [],
    columns: [],
    dataSource: [],
    tableName: "bbs_post",
    hideColumns: [
      "boardId",
      "userId",
      "categoryId",
      "version",
      "deleted",
      "id",
    ],
    columnFactory: {
      content: {
        customRender: ({ value, record }) =>
          h("span", [
            max(value, 20),
            h(
              "a",
              { href: "/bbs/post/" + (record as any).id, target: "_blank" },
              "详情"
            ),
          ]),
      },
      title: {
        customRender: ({ value }) => max(value, 20),
      },
      recommend: { customRender: booleanRender },
      globalPinned: { customRender: booleanRender },
      published: { customRender: booleanRender },
      pinned: { customRender: booleanRender },
      banned: { customRender: booleanRender },
      removed: { customRender: booleanRender },
      ...createDefaultColumnFactory(),
    },
    page: 1,
    size: 10,
  })
);

function booleanRender({ value }: any) {
  return !!value ? "是" : "-";
}

onBeforeMount(() => {
  table.value.init();
  originDataSource.value = table.value.dataSource;
});

function onCreate() {
  table.value.update();
  originDataSource.value = table.value.dataSource;
}
function onModify() {
  table.value.update();
  originDataSource.value = table.value.dataSource;
}

function onPaginationChange(pagination: any) {
  table.value.page = pagination.current;
  table.value.size = pagination.pageSize;
  table.value.update();
}

function advanceSearch() {
  BBSApi.advanceSearch(search).then(({ data: { data } }) => {
    searchResult.value = data.map((d) => d.post);
    table.value.dataSource = searchResult.value;
  });
}

function reset() {
  searchResult.value = [];
  table.value.dataSource = originDataSource.value;

  search.recommend = false;
  search.banned = false;
  search.boardName = "";
  search.categoryName = "";
  search.content = "";
  search.title = "";
  search.nickname = "";
  search.username = "";
}
</script>
<style scoped lang="less">
.search-item {
  white-space: nowrap;
  display: flex;
}
</style>
