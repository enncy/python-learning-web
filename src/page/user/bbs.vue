<template>
  <div>
    <Card v-if="userInfo">
      <a-row>
        <a-col :span="4">
          <a-statistic class="me-3" title="文章数" :value="userInfo.postCount">
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="草稿数" :value="userInfo.draftCount">
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic class="me-3" title="总阅读" :value="userInfo.viewCount">
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="总评论" :value="userInfo.commentCount">
          </a-statistic>
        </a-col>
      </a-row>
    </Card>
    <Card>
      <PostTable :posts="posts">
        <template #head>
          <th class="fw-normal">状态</th>
          <th class="fw-normal">操作</th>
        </template>
        <template #tail="{ post }">
          <td>
            {{ post.post.published ? "公开" : "草稿" }}
          </td>
          <td>
            <a-button
              type="link"
              size="small"
              @click="router.push('/bbs/modify/' + post.post.id)"
            >
              修改
            </a-button>
            <a-popconfirm
              title="确定删除此帖子吗？"
              okText="确实"
              cancelText="取消"
              @confirm="remove(post.post.id)"
            >
              <a-button size="small" type="link" danger> 删除 </a-button>
            </a-popconfirm>
          </td>
        </template>
      </PostTable>

      <div class="mt-3 text-center">
        <Pagination v-model:pagination="pagination"></Pagination>
      </div>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { BBSApi, UserApi } from "../../api";
import { BBSPostModel, UserInfo } from "../../store/interface";
import PostTable from "../../components/bbs/PostTable.vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import Pagination from "../../components/common/Pagination.vue";
import Card from "../../components/common/Card.vue";
import { store } from "../../store";

const posts = ref<BBSPostModel[]>([]);
const router = useRouter();
const userInfo = ref<UserInfo>();

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

watch(
  () => [pagination.page, pagination.size],
  () => {
    renderData();
  }
);

onMounted(() => {
  renderData();
});

function renderData() {
  UserApi.listPostModel({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      if (data) {
        posts.value = data.records;
        pagination.total = data.total;
      }
    }
  );

  if (store.user) {
    UserApi.userInfo({ id: store.user?.id }).then(({ data: { data } }) => {
      if (data) {
        userInfo.value = data;
      }
    });
  }
}

function remove(postId: string) {
  BBSApi.removePost({ id: postId }).then(({ data: { data, msg } }) => {
    data ? message.success(msg) : message.error(msg);
  });
}
</script>
<style scoped lang="less">
tr td {
  padding: 6px 0px;
  border-bottom: 1px dashed #cecece;
}
</style>
