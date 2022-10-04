<template>
  <Card>
    <div v-if="favorites?.length">
      <PostTable :posts="favorites?.map((f) => f.postModel)">
        <template #head>
          <th class="fw-normal">收藏于</th>
          <th class="fw-normal">操作</th>
        </template>
        <template #tail="{ post }">
          <td>
            {{ dayjs(post.post.createTime).format("YYYY-MM-DD hh:mm") }}
          </td>
          <td>
            <a-popconfirm
              title="确定取消收藏吗？"
              okText="确实"
              cancelText="取消"
              @confirm="cancel(post.post.id)"
            >
              <a-button size="small" type="link" danger> 取消收藏 </a-button>
            </a-popconfirm>
          </td>
        </template>
      </PostTable>
    </div>
    <div v-else>
      <a-empty></a-empty>
    </div>

    <div class="mt-3 text-center">
      <Pagination v-model:pagination="pagination"></Pagination>
    </div>
  </Card>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
import { UserApi } from "../../api";
import {
  BBSPostModel,
  UserFavoriteModel,
  UserFollowModel,
} from "../../store/interface";
import PostList from "../../components/bbs/PostList.vue";
import PostTable from "../../components/bbs/PostTable.vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { getElapsedTime } from "../../utils";
import dayjs from "dayjs";

const router = useRouter();

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

const favorites = ref<UserFavoriteModel[]>();

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
  UserApi.listFavorite({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      favorites.value = data.records;
      pagination.total = data.total;
    }
  );
}

async function cancel(id: string) {
  const {
    data: { data, msg },
  } = await UserApi.cancelFavorite({ id });
  data ? message.success(msg) : message.error(msg);
}
</script>
<style scoped lang="less">
tr td {
  padding: 6px 0px;
  border-bottom: 1px dashed #cecece;
}
</style>
