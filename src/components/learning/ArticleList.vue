<template>
  <div class="mb-2 border-bottom">
    <b>文章</b>
    <span> - {{ articles.length }}</span>
  </div>
  <template v-for="article of articles">
    <div
      class="article-list-item"
      :class="{
        active: article.id === currentArticleId,
      }"
      @click="switchArticle(article.id)"
    >
      <span>{{ article.title }}</span>
    </div>
  </template>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { LearningArticle } from "../../store/interface";

defineProps<{
  articles: LearningArticle[];
  currentArticleId: string;
}>();

const router = useRouter();

function switchArticle(id: string) {
  window.location.replace("/learning/article/" + id);
}
</script>
<style scoped lang="less">
.article-list-item {
  cursor: pointer;
  padding: 6px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0px 0px 4px #d3d3d3;
}

.article-list-item + .article-list-item {
  margin-top: 8px;
}

.article-list {
  border-radius: 4px;
}

.article-list-item:hover {
  color: #1890ff;
}

.article-list-item.active {
  color: #1890ff;
}
</style>
