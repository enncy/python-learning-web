<template>
  <div class="page-lg" v-if="post.categoryId && post.boardId">
    <div class="mb-3 h-100">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <Icon type="icon-home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/board')">
          论坛首页
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/board#' + post.boardId)">
          {{ boardName }}
        </a-breadcrumb-item>
        <a-breadcrumb-item
          @click="router.push('/bbs/category/' + post.categoryId)"
        >
          {{ categoryName }}
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/category/new')">
          发布帖子
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <Card class="d-flex">
      <a-input v-model:value="post.title" placeholder="输入帖子标题"></a-input>
      <a-button type="primary" @click="visible = true">
        {{ isNewPost ? "发布" : "更新" }}
      </a-button>
    </Card>

    <Card>
      <MarkdownEditor class="h-100" v-model:content="post.content">
      </MarkdownEditor>
    </Card>

    <SimplifyModel :width="500" v-model:visible="visible">
      <table>
        <tbody>
          <tr>
            <td>标题:</td>
            <td>
              <a-input
                style="width: 300px"
                v-model:value="post.title"
                placeholder="输入帖子标题"
              ></a-input>
            </td>
          </tr>
          <tr>
            <td>标签:</td>
            <td><TagList v-model:tags="tags"></TagList></td>
          </tr>
          <tr>
            <td>草稿:</td>
            <td><a-switch v-model:checked="post.published"></a-switch></td>
          </tr>
          <tr>
            <td>置顶帖子:</td>
            <td><a-switch v-model:checked="post.pinned"></a-switch></td>
          </tr>
        </tbody>
      </table>
      <div class="mt-3 d-flex justify-content-end">
        <a-button type="primary" @click="publish">
          {{ isNewPost ? "发布" : "更新" }}
        </a-button>
      </div>
    </SimplifyModel>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BBSApi } from "../../api";
import { BBSCategoryModel, BBSPostModel } from "../../store/interface";
import Card from "../../components/common/Card.vue";
import Icon from "../../components/common/Icon.vue";
import MarkdownEditor from "../../components/common/MarkdownEditor.vue";
import SimplifyModel from "../../components/common/SimplifyModel.vue";
import TagList from "../../components/common/TagList.vue";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();
const categoryName = ref<string>();
const boardName = ref<string>();
const visible = ref(false);
const tags = ref<string[]>([]);
const isNewPost = ref(true);

const post = reactive({
  title: "",

  content:
    "> 倘若说，作品愈高，知音愈少。那么，推论起来，谁也不懂的东西，就是世界上的绝作了。——鲁迅\n",
  published: true,
  pinned: false,
  id: "",
  boardId: "",
  categoryId: "",
});

onMounted(() => {
  if (
    route.params.categoryId !== undefined &&
    !Array.isArray(route.params.categoryId)
  ) {
    // 获取版块模型
    BBSApi.getCategoryModel({
      id: route.params.categoryId,
      page: 0,
      size: 0,
    }).then(({ data: { data } }) => {
      if (data) {
        categoryName.value = data.category.name;
        post.boardId = data.board.id;
        post.categoryId = data.category.id;
      } else {
        router.replace("/404");
      }
    });
  } else if (
    route.params.postId !== undefined &&
    !Array.isArray(route.params.postId)
  ) {
    // 获取修改文章
    BBSApi.getPostModel({ id: route.params.postId, page: 1, size: 1 }).then(
      ({ data: { data: d } }) => {
        if (d) {
          const data: BBSPostModel = d;
          Object.assign(post, data.post);
          post.pinned = !!post.pinned;
          post.published = !!post.published;
          categoryName.value = data.category.name;
          boardName.value = data.board.name;
          tags.value = data.tags.map((t) => t.name);
          isNewPost.value = false;
        } else {
          router.replace("/404");
        }
      }
    );
  }
});

function publish() {
  BBSApi.publishPost({ tags: tags.value, post }).then(
    ({ data: { data, msg } }) => {
      if (data) {
        message.success(msg);
        setTimeout(() => router.push("/user/bbs"), 1000);
      } else {
        message.error(msg);
      }
    }
  );
}
</script>
<style scoped lang="less">
.editor {
  height: 50vh;
}

table {
  tr td {
    padding: 8px;
  }

  tr td:first-child {
    white-space: nowrap;
  }
}
</style>
