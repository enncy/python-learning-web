<template>
  <div class="col-lg-8 col-12 m-auto mt-3">
    <a-back-top />
    <div class="mb-3">
      <a-space>
        <template v-for="category of categories">
          <a-button
            :type="category.id === currentCategoryId ? 'primary' : 'default'"
            shape="round"
            @click="listArticle(category.id)"
          >
            {{ category.name }}
          </a-button>
        </template>
      </a-space>
    </div>
    <div class="d-flex" style="gap: 12px" v-if="articles.length">
      <div class="col-2 article-list border rounded p-3">
        <template v-for="article of articles">
          <div
            class="article-list-item"
            :class="{
              active: article.id === currentArticleId,
            }"
            @click="
              (currentArticleId = article.id),
                router.replace('/learning/article/' + article.id)
            "
          >
            {{ article.title }}
          </div>
        </template>
      </div>
      <div ref="content" class="col-8 article-content border rounded p-3">
        <div class="fs-2 fw-bold mb-3 border-bottom">
          {{ articles.find((a) => a.id === currentArticleId)?.title || "" }}
        </div>

        <MarkdownText
          :content="
            articles.find((a) => a.id === currentArticleId)?.content || ''
          "
        >
        </MarkdownText>
      </div>
      <div class="col-2 article-list" v-if="anchors.length">
        <div class="toc">
          <div class="mb-2 border-bottom">
            <b>目录:</b>
          </div>
          <template v-for="anchor of anchors">
            <div :style="{ marginLeft: (anchor.level - 1) * 20 + 'px' }">
              <a :href="`#${anchor.id}`" class="text-secondary anchor">
                {{ anchor.title }}
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      <a-empty></a-empty>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LearningApi } from "../../api";
import { nextTick, ref, watch } from "vue";
import { LearningArticle, LearningCategory } from "../../store/interface";
import MarkdownText from "../../components/common/MarkdownText.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const categories = ref<LearningCategory[]>([]);
const articles = ref<LearningArticle[]>([]);
const currentCategoryId = ref<string>("");
const currentArticleId = ref<string>(
  route.params.articleId ? route.params.articleId.toString() : ""
);
const content = ref<HTMLDivElement>();
const anchors = ref<
  {
    id: string;
    title: string;
    level: number;
  }[]
>([]);

LearningApi.listCategory().then(({ data: { data } }) => {
  categories.value = data;
  if (currentArticleId.value) {
    LearningApi.getArticle(currentArticleId.value).then(
      ({ data: { data } }) => {
        currentCategoryId.value = data.categoryId;
        LearningApi.listArticle(currentCategoryId.value).then(
          ({ data: { data } }) => {
            articles.value = data;
            nextTick(() => {
              renderTOC();
            });
          }
        );
      }
    );
  } else {
    listArticle(data[0].id);
  }
});

watch(currentArticleId, () => {
  nextTick(() => {
    renderTOC();
  });
});

function listArticle(cid: string) {
  currentCategoryId.value = cid;
  LearningApi.listArticle(cid).then(({ data: { data } }) => {
    articles.value = data;

    if (data.length) {
      router.replace("/learning/article/" + data[0].id);
      currentArticleId.value = data[0].id;
    }
  });
}

/**
 * 自动生成目录
 */
function renderTOC() {
  anchors.value = [];
  if (content.value) {
    const els = Array.from(content.value.querySelectorAll("h1,h2,h3,h4"));
    for (const el of els) {
      const id = el.textContent?.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, "_") || "";
      el.setAttribute("id", id);
      anchors.value.push({
        id,
        title: el.textContent || "",
        level: parseInt(el.tagName.replace(/H/g, "")),
      });
    }
  }

  if (document.location.hash) {
    document
      .querySelector(decodeURIComponent(document.location.hash))
      ?.scrollIntoView();
  }
}
</script>
<style scoped lang="less">
.article-list-item {
  cursor: pointer;
  padding: 4px;
  border-bottom: 1px solid gainsboro;
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
.anchor {
  text-decoration: underline;
}

.toc {
  position: sticky;
  top: 20px;
}
</style>
