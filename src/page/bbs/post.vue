<template>
  <div class="page">
    <Loading :loading="loading">
      <div v-if="board && category">
        <div v-if="postModel?.post?.published && board && category">
          <div class="mb-3">
            <a-breadcrumb>
              <a-breadcrumb-item>
                <Icon type="icon-home" />
              </a-breadcrumb-item>
              <a-breadcrumb-item @click="router.push('/bbs/board')">
                论坛首页
              </a-breadcrumb-item>
              <a-breadcrumb-item
                @click="router.push('/bbs/board#' + board!.id)"
              >
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
                <MaxSpan :value="postModel.post.title" :length="50"></MaxSpan>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>

          <Card>
            <table class="w-100">
              <tr>
                <td class="p-1 text-center fw-bold post-count">
                  评论 : {{ postModel.post.commentCount }} / 查看:
                  {{ postModel.post.viewCount }}
                </td>
                <td class="p-1 ps-3">
                  <h2 class="mb-0">
                    <template v-for="tag of postModel.tags">
                      <span class="post-tag">[{{ tag.name }}]</span>
                    </template>
                    <span class="fw-bold ms-1">
                      {{ postModel.post.title }}
                    </span>
                  </h2>
                </td>
              </tr>
              <PostTableRow
                :badge="badges[0]"
                :post-id="postModel.post.id"
                :post-model="postModel"
                @comment="onComment"
              ></PostTableRow>

              <PostTableRow
                v-for="(model, index) of comments"
                :key="model.comment.id"
                :badge="badges[model.comment.level]"
                :post-id="postModel.post.id"
                :comment-model="model"
                @comment="onComment"
              ></PostTableRow>
            </table>

            <div class="text-end mt-5">
              <Pagination v-model:pagination="pagination"></Pagination>
            </div>
          </Card>

          <Card>
            <MarkdownEditor
              :height="100"
              title="评论区"
              v-model:content="comment.content"
            >
              <template #actions> </template>
            </MarkdownEditor>
            <div
              ref="commentCard"
              class="mt-3 w-100 d-flex justify-content-end"
            >
              <a-button type="primary" ghost @click="publishComment">
                发表评论
              </a-button>
            </div>
          </Card>
        </div>
        <div v-else>
          <a-result status="403" title="此文章暂未公开哦~">
            <template #extra>
              <a-button type="primary" @click="router.back()"
                >返回上一页</a-button
              >
            </template>
          </a-result>
        </div>
      </div>
      <div v-else>
        <NotFound></NotFound>
      </div>
    </Loading>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import MaxSpan from "../../components/common/MaxSpan.vue";
import {
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  TransitionGroup,
  watch,
} from "vue";
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
import NotFound from "../../components/common/NotFound.vue";
import Loading from "../../components/common/Loading.vue";

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
const loading = ref(true);

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
      if (data) {
        postModel.value = data;
        category.value = data.category;
        board.value = data.board;
        comments.value = data.commentPage.records;
        pagination.total = data.commentPage.total;
        comment.postId = data.post.id;
      }

      loading.value = false;
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

table {
  table-layout: fixed;
}

.post-count {
  width: 150px;
}

.in-mobile {
  .post-count {
    width: 64px;
  }
}
</style>
