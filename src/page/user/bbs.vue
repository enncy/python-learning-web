<template>
  <div>
    <PostList :posts="posts">
      <template #head>
        <th class="fw-normal">操作</th>
      </template>
      <template #tail="{ post }">
        <td>
          <a-button
            type="link"
            @click="router.push('/bbs/modify/' + post.post.id)"
            >修改</a-button
          >
          <a-button type="link" danger @click="remove(post.post.id)"
            >删除</a-button
          >
        </td>
      </template>
    </PostList>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { UserApi } from "../../api";
import { BBSPostModel } from "../../store/interface";
import PostList from "../../components/bbs/PostList.vue";
import { useRouter } from "vue-router";

const posts = ref<BBSPostModel[]>([]);
const router = useRouter();

UserApi.listPostModel({ page: 1, size: 10 }).then(({ data: { data } }) => {
  if (data) {
    posts.value = data.records;
  }
});

function remove(postId: string) {}
</script>
<style scoped lang="less">
tr td {
  padding: 6px 0px;
  border-bottom: 1px dashed #cecece;
}
</style>
