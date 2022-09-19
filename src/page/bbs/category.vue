<template>
  <div class="page" v-if="categoryModel">
    <div class="mb-3">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <Icon type="icon-home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/board')">
          论坛首页
        </a-breadcrumb-item>
        <a-breadcrumb-item
          @click="router.push('/bbs/board#' + categoryModel!.board.id)"
        >
          {{ categoryModel.board.name }}
        </a-breadcrumb-item>
        <a-breadcrumb-item
          @click="router.push('/bbs/category/' + categoryModel!.category.id)"
        >
          {{ categoryModel.category.name }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <Card class="mb-3">
      <div class="row">
        <div class="col-12 col-lg-2">
          <a-avatar shape="square" style="width: 124px" :size="124"></a-avatar>
        </div>
        <div class="col-12 col-lg-10">
          <div class="row border-bottom mb-3">
            <div class="col d-flex align-items-baseline">
              <h2 class="mb-0">{{ categoryModel.category.name }}</h2>
              <span class="text-secondary sm">
                <a-divider type="vertical" />
                {{
                  dayjs(categoryModel.category.createTime).format("YYYY-MM-DD")
                }}
                创建
                <a-divider type="vertical" />
                排名: 1
                <a-divider type="vertical" />
                主题: 2
              </span>
            </div>
            <div class="col">
              <div class="row justify-content-end">
                <div class="col-auto">
                  <a-button type="primary" ghost size="small">+ 订阅</a-button>
                </div>
                <div class="col-auto">
                  <a-button
                    type="primary"
                    size="small"
                    @click="
                      router.push('/bbs/new/' + categoryModel!.category.id)
                    "
                    >+ 发布帖子</a-button
                  >
                </div>
              </div>
            </div>
          </div>
          <div>
            版主：
            <BoardAdminList :admins="categoryModel.admins" />
          </div>
          <div>
            {{ categoryModel.category.description }}
          </div>
        </div>
      </div>

      <a-divider></a-divider>

      <PostTable :posts="globalPosts.concat(posts)"></PostTable>

      <Pagination class="mt-5 text-end" v-model:pagination="pagination" />
    </Card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BBSApi } from "../../api/bbs";
import Card from "../../components/common/Card.vue";
import { BBSCategoryModel } from "../../store/interface";
import Icon from "../../components/common/Icon.vue";
import dayjs from "dayjs";
import { BBSPostModel } from "../../store/interface";
import BoardAdminList from "../../components/bbs/BoardAdminList.vue";
import PostTable from "../../components/bbs/PostTable.vue";
import Pagination from "../../components/common/Pagination.vue";

const route = useRoute();
const router = useRouter();

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

const posts = ref<BBSPostModel[]>([]);
const globalPosts = ref<BBSPostModel[]>([]);
const categoryModel = ref<BBSCategoryModel>();

watch(pagination, () => {
  renderData();
});

onMounted(() => {
  renderData();
});

function renderData() {
  if (
    route.params.categoryId === undefined ||
    Array.isArray(route.params.categoryId)
  ) {
    useRouter().push("/404");
  } else {
    // 获取文章列表
    BBSApi.getCategoryModel({
      id: route.params.categoryId,
      page: pagination.page,
      size: pagination.size,
    }).then(({ data: { data } }) => {
      if (data) {
        categoryModel.value = data;
        posts.value = data.postPage.records;
        pagination.total = data.postPage.total;
      }
    });

    // 获取全局公告
    BBSApi.listGlobalPosts({ page: 1, size: 5 }).then(({ data: { data } }) => {
      if (data) {
        globalPosts.value = data;
      }
    });
  }
}
</script>
<style scoped lang="less">
.text-secondary.sm {
  font-size: 12px;
  font-weight: 100;
}
</style>
