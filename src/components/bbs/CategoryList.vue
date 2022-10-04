<template>
  <div>
    <template v-for="(categoryModel, index) of categoryModels" :key="index">
      <div class="category row">
        <div class="col-3 col-lg-1">
          <a-avatar shape="square" :size="42"></a-avatar>
        </div>
        <div class="col-9 col-lg-3">
          <div
            class="category-title"
            @click="router.push(`/bbs/category/${categoryModel.category.id}`)"
          >
            <div class="fw-bold">
              {{ categoryModel.category.name }}
              <span class="text-secondary sm"
                >({{ categoryModel.postPage.total }})</span
              >
            </div>
            <div class="text-secondary sm">
              <MaxSpan
                :value="categoryModel.category.description"
                :length="50"
              ></MaxSpan>
            </div>
          </div>
        </div>
        <div
          v-if="categoryModel.postPage.records[0]"
          class="col-lg-8 d-none d-lg-block category-post"
          @click="
            router.push(
              '/bbs/post/' + categoryModel.postPage.records[0].post.id
            )
          "
        >
          <div>
            <MaxSpan
              :value="categoryModel.postPage.records[0].post.title"
              :length="50"
            ></MaxSpan>
          </div>
          <div class="text-secondary sm">
            {{
              getElapsedTime(categoryModel.postPage.records[0].post.createTime)
            }}前 -
            {{
              categoryModel.postPage.records[0].user.nickname ||
              categoryModel.postPage.records[0].user.username
            }}
          </div>
        </div>
        <div v-else class="col-lg-8 d-none d-lg-block category-post">
          <div>暂无帖子</div>
          <div></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { BBSCategoryModel } from "../../store/interface";
import { getElapsedTime } from "../../utils";

const router = useRouter();

const props = defineProps<{
  categoryModels: BBSCategoryModel[];
}>();

console.log(props.categoryModels);
</script>
<style scoped lang="less">
.category {
  padding: 12px 0px;
}

.category + .category {
  border-top: 1px dashed #dbdbdb;
}

.category-title {
  cursor: pointer;
}
.category-post {
  cursor: pointer;
}
</style>
