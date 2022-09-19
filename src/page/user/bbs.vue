<template>
  <div>
    <PostTable :posts="posts">
      <template #head>
        <th class="fw-normal">操作</th>
      </template>
      <template #tail="{ post }">
        <td>
          <a-button
            type="link"
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
            <a-button type="link" danger> 删除 </a-button>
          </a-popconfirm>
        </td>
      </template>
    </PostTable>

    <div class="mt-3 text-end">
      <Pagination v-model:pagination="pagination"></Pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { BBSApi, UserApi } from "../../api";
import { BBSPostModel } from "../../store/interface";
import PostTable from "../../components/bbs/PostTable.vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import Pagination from "../../components/common/Pagination.vue";

const posts = ref<BBSPostModel[]>([]);
const router = useRouter();

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
  UserApi.listPostModel({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      if (data) {
        posts.value = data.records;
        pagination.total = data.total;
      }
    }
  );
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
