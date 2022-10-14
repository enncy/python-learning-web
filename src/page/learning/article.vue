<template>
  <div class="page-learning-article pb-5">
    <!-- 移动端适配 -->
    <MobilePanel v-if="store.state.inMobile">
      <ArticleList
        :articles="articles"
        :currentArticleId="currentArticleId"
      ></ArticleList>
      <TOC class="mt-5" :anchors="anchors" />
    </MobilePanel>
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

    <div ref="learningArticle">
      <div
        class="d-flex col-lg-8 col-12 m-auto learning-container"
        style="gap: 12px"
        v-if="articles.length"
      >
        <div class="col-2 article-list rounded" v-if="!store.state.inMobile">
          <ArticleList
            :articles="articles"
            v-model:currentArticleId="currentArticleId"
          ></ArticleList>
        </div>
        <div :class="store.state.inMobile ? 'col-12' : 'col-8'">
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
              <MarkdownText
                :class="store.state.inMobile ? 'p-1' : 'p-3'"
                :content="currentArticle.content || ''"
              >
              </MarkdownText>
            </div>
          </Card>
        </div>
        <TOC
          class="col-2 article-list"
          v-if="anchors.length"
          :anchors="anchors"
        />
      </div>
      <div v-else>
        <a-empty></a-empty>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LearningApi } from "../../api";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { LearningArticle, LearningCategory } from "../../store/interface";
import MarkdownText from "../../components/common/MarkdownText.vue";
import { useRoute, useRouter } from "vue-router";
import Card from "../../components/common/Card.vue";
import { getElapsedTime } from "../../utils";
import dayjs from "dayjs";
import MobilePanel from "../../components/common/MobilePanel.vue";
import { store } from "../../store";
import ArticleList from "../../components/learning/ArticleList.vue";
import TOC from "../../components/learning/TOC.vue";

const route = useRoute();
const router = useRouter();

const categories = ref<LearningCategory[]>([]);
const articles = ref<LearningArticle[]>([]);
const currentCategoryId = ref<string>("");
const currentArticleId = ref<string>(
  route.params.articleId ? route.params.articleId.toString() : ""
);
const currentArticle = ref();
// 是否处于全屏
const isInFullScreen = ref(false);
const learningArticle = ref<HTMLDivElement>();
const content = ref<HTMLDivElement>();
const currentTextContent = ref("");

const anchors = ref<
  {
    id: string;
    title: string;
    level: number;
  }[]
>([]);

function listArticle(cid: string) {
  currentCategoryId.value = cid;
  LearningApi.listArticle(cid).then(({ data: { data } }) => {
    if (data.length) {
      window.location.replace("/learning/article/" + data[0].id);
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

onMounted(() => {
  nextTick(() => {
    LearningApi.listCategory().then(({ data: { data } }) => {
      categories.value = data;
      if (currentArticleId.value) {
        LearningApi.getArticle(currentArticleId.value).then(
          ({ data: { data } }) => {
            currentCategoryId.value = data.categoryId;
            LearningApi.listArticle(currentCategoryId.value).then(
              ({ data: { data } }) => {
                articles.value = data;
                currentArticle.value = articles.value.find(
                  (a) => a.id === currentArticleId.value
                );
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
  });
});
</script>
<style scoped lang="less">
.learning-container {
  background-color: #f8f8f8;
  padding: 24px 0px;
}

.text-underline {
  text-decoration: underline;
  cursor: pointer;
}
</style>
