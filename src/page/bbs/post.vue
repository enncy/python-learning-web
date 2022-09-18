<template>
  <div class="page" v-if="category && board && postModel">
    <div class="mb-3">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <Icon type="icon-home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/board')">
          论坛首页
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/board#' + board!.id)">
          {{ board.name }}
        </a-breadcrumb-item>
        <a-breadcrumb-item
          @click="router.push('/bbs/category/' + category!.id)"
        >
          {{ category.name }}
        </a-breadcrumb-item>
        <a-breadcrumb-item
          @click="router.push('/bbs/post/' + postModel!.post.id)"
        >
          <MaxSpan :value="postModel.post.title" :length="20"></MaxSpan>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <Card>
      <table class="w-100">
        <tr>
          <td class="p-1 text-center fw-bold">
            评论 : {{ postModel.post.commentCount }} / 查看:
            {{ postModel.post.viewCount }}
          </td>
          <td class="p-1 ps-3">
            <h2 class="mb-0 fw-bold">
              <template v-for="tag of postModel.tags">
                <span class="post-tag">[{{ tag.name }}]</span>
              </template>
              {{ postModel.post.title }}
            </h2>
          </td>
        </tr>
        <PostTableRow
          :badge="badges[0]"
          :post-id="postModel.post.id"
          :post-model="postModel"
          @comment="onComment"
        ></PostTableRow>
        <template v-for="(model, index) of comments" :key="model.comment.id">
          <PostTableRow
            :badge="badges[model.comment.level]"
            :post-id="postModel.post.id"
            :comment-model="model"
            @comment="onComment"
          ></PostTableRow>
        </template>
      </table>

      <div class="text-end mt-5">
        <Pagination v-model:pagination="pagination"></Pagination>
      </div>
    </Card>

    <Card>
      <MarkdownEditor title="评论区" v-model:content="comment.content">
        <template #actions> </template>
      </MarkdownEditor>
      <div ref="commentCard" class="mt-3 w-100 d-flex justify-content-end">
        <a-button type="primary" ghost @click="publishComment">
          发表评论
        </a-button>
      </div>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import MaxSpan from "../../components/common/MaxSpan.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { BBSApi } from "../../api";
import {
  BBSBoard,
  BBSCategory,
  BBSCommentModel,
  BBSPostModel,
} from "../../store/interface";
import Card from "../../components/common/Card.vue";
import Icon from "../../components/common/Icon.vue";
import MarkdownEditor from "../../components/common/MarkdownEditor.vue";
import { message } from "ant-design-vue";
import PostTableRow from "../../components/bbs/PostTableRow.vue";
import Pagination from "../../components/common/Pagination.vue";

const router = useRouter();
const route = useRoute();
const postModel = ref<BBSPostModel>();
const category = ref<BBSCategory>();
const board = ref<BBSBoard>();
const comments = ref<BBSCommentModel[]>([]);
const commentCard = ref<HTMLDivElement>();

const comment = reactive({
  content: "",
  postId: "",
  parentId: "",
});

const badges = [
  {
    text: "楼主",
    color: "#108ee9",
  },
  {
    text: "沙发",
    color: "volcano",
  },
  {
    text: "板凳",
    color: "#2db7f5",
  },
  {
    text: "地板",
    color: "#a5a5a5",
  },
];

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

watch(pagination, () => {
  renderData();
});

onMounted(() => {
  renderData();
});

function renderData() {
  if (route.params.postId === undefined || Array.isArray(route.params.postId)) {
    useRouter().push("/404");
  } else {
    BBSApi.getPostModel({
      id: route.params.postId,
      page: pagination.page,
      size: pagination.size,
    }).then(({ data: { data } }) => {
      postModel.value = data;
      category.value = data.category;
      board.value = data.board;
      comments.value = data.commentPage.records;
      pagination.total = data.commentPage.total;
      comment.postId = data.post.id;
    });
  }
}

function onComment() {
  commentCard.value?.scrollIntoView({
    behavior: "smooth",
  });
}

function publishComment() {
  BBSApi.publishComment(comment).then(({ data: { data, msg } }) => {
    data ? message.success(msg) : message.error(msg);
  });
}
</script>
<style scoped lang="less">
tr td {
  border-bottom: 2px solid #aaaaaa;
}

tr > td:first-child {
  background-color: #f0f0f0;
}

.post-tag {
  cursor: pointer;
  text-decoration: dashed;
}
.post-tag:hover {
  color: rgba(56, 142, 212, 0.699);
}
</style>
