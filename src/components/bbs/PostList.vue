<template>
  <template v-for="model of posts">
    <div class="post-list" @click="router.push('/bbs/post/' + model.post.id)">
      <MaxSpan :value="model.post.title" :length="20"></MaxSpan>
      <span class="float-end">
        {{ model.post.commentCount }} /
        <span class="text-secondary sm"> {{ model.post.viewCount }}</span>
      </span>
    </div>
  </template>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { BBSPostModel } from "../../store/interface";
import MaxSpan from "../common/MaxSpan.vue";

defineProps<{
  posts: BBSPostModel[];
}>();

const router = useRouter();
</script>
<style scoped lang="less">
.post-list {
  cursor: pointer;
  padding: 4px 0px;
  border-bottom: 1px dashed #dadada;
}
</style>
