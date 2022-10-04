<template>
  <div class="page-learning-article pb-5">
    <div class="bg-white pt-3 mb-1 shadow-sm">
      <div class="col-lg-6 col-12 m-auto">
        <a-menu mode="horizontal" :selectedKeys="[currentCategoryId]">
          <a-menu-item
            v-for="category of categories"
            :key="category.id"
            @click="listArticle(category.id)"
          >
            {{ category.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </div>

    <div ref="learningArticle" class="learning-container">
      <div
        class="d-flex col-lg-8 col-12 m-auto"
        style="gap: 12px"
        v-if="articles.length"
      >
        <div class="col-2 article-list rounded">
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
              @click="
                (currentArticleId = article.id),
                  router.replace('/learning/article/' + article.id)
              "
            >
              <span>{{ article.title }}</span>
            </div>
          </template>
        </div>
        <div class="col-8">
          <Card v-if="currentArticle" class="p-0">
            <div class="fs-3 fw-bold mb-3 pb-1 border-bottom">
              <span>{{ currentArticle.title || "" }}</span>
              <a-divider type="vertical" />
              <span class="text-secondary sm">
                {{ dayjs(currentArticle.updateTime).format("YYYY-MM-DD") }}
              </span>
              <a-divider type="vertical" />
              <span class="text-secondary sm">
                {{ currentTextContent.length }}字
              </span>
              <a-divider type="vertical" />
              <span class="text-secondary sm">
                阅读需约{{
                  Math.max(
                    Math.round((currentTextContent.length || 1) / 500),
                    1
                  )
                }}分钟
              </span>
              <a-divider type="vertical" />
              <span
                class="text-secondary sm text-underline"
                @click="fullscreen"
              >
                {{ isInFullScreen ? "退出" : "进入" }}沉浸式阅读
              </span>
            </div>

            <div ref="content">
              <MarkdownText class="p-3" :content="currentArticle.content || ''">
              </MarkdownText>
            </div>
          </Card>
        </div>
        <div class="col-2 article-list" v-if="anchors.length">
          <div class="toc">
            <div class="mb-2 border-bottom">
              <b>目录</b>
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
  </div>
</template>
<script setup lang="ts">
import { LearningApi } from "../../api";
import { computed, nextTick, ref, watch } from "vue";
import { LearningArticle, LearningCategory } from "../../store/interface";
import MarkdownText from "../../components/common/MarkdownText.vue";
import { useRoute, useRouter } from "vue-router";
import Card from "../../components/common/Card.vue";
import { getElapsedTime } from "../../utils";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();

const categories = ref<LearningCategory[]>([]);
const articles = ref<LearningArticle[]>([]);
const currentCategoryId = ref<string>("");
const currentArticleId = ref<string>(
  route.params.articleId ? route.params.articleId.toString() : ""
);
const currentArticle = computed(() =>
  articles.value.find((a) => a.id === currentArticleId.value)
);
const isInFullScreen = ref(false);
const learningArticle = ref<HTMLDivElement>();
const content = ref<HTMLDivElement>();
const currentTextContent = ref("");
watch(currentArticle, () => {
  nextTick(() => {
    currentTextContent.value = content.value?.textContent || "";
  });
});

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

function fullscreen() {
  if (isInFullScreen.value) {
    document.exitFullscreen();
  } else {
    learningArticle.value?.requestFullscreen();
  }
}

document.addEventListener("fullscreenchange", function () {
  isInFullScreen.value = document.fullscreenElement !== null;
});
</script>
<style scoped lang="less">
.learning-container {
  background-color: #f8f8f8;
  overflow-y: auto;
  padding: 24px 0px;
}
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
.anchor {
  text-decoration: underline;
}

.toc {
  position: sticky;
  top: 20px;
}

.text-underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
