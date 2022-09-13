<template>
  <div class="container mt-3" v-if="categoryModel">
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
        <div class="col-4">
          <a-avatar shape="square" :size="124"></a-avatar>
        </div>
        <div class="col-8">
          {{ categoryModel?.category.description }}
        </div>
      </div>
    </Card>

    <PostProvider
      v-model:pagination="pagination"
      @update="(data) => (posts = data)"
    />

    <Card class="mb-3 mt-3"> 111 </Card>

    <PostProvider
      v-model:pagination="pagination"
      @update="(data) => (posts = data)"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BBSApi } from "../../api/bbs";
import Card from "../../components/common/Card.vue";
import { BBSCategoryModel, BBSPost } from "../../store/interface";
import Icon from "../../components/common/Icon.vue";
import PostProvider from "../../components/common/PostProvider.vue";

const route = useRoute();
const router = useRouter();

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

const posts = ref<BBSPost[]>();
const categoryModel = ref<BBSCategoryModel>();

onMounted(() => {
  if (
    route.params.categoryId === undefined ||
    Array.isArray(route.params.categoryId)
  ) {
    useRouter().push("/404");
  } else {
    BBSApi.getCategoryModel({ id: route.params.categoryId }).then(
      ({ data: { data } }) => {
        categoryModel.value = data;
        if (categoryModel.value) {
          pagination.page = categoryModel.value.posts.current;
          pagination.size = categoryModel.value.posts.size;
          pagination.total = categoryModel.value.posts.total;
        }

        console.log(pagination);

        console.log(categoryModel.value);
      }
    );
  }
});
</script>
<style scoped lang="less"></style>
