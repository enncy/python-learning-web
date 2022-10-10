<template>
  <table v-if="posts.length" class="w-100 text-start">
    <thead>
      <tr class="text-secondary text-nowrap sm">
        <th class="fw-normal">标题</th>
        <th class="fw-normal">作者</th>
        <th class="fw-normal">最后回复</th>
        <th class="fw-normal">回复/查看</th>
        <slot name="head"></slot>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, index) of posts" :key="index">
        <tr>
          <!-- 标题 -->
          <td @click="router.push('/bbs/post/' + item.post.id)">
            <div>
              <MaxSpan
                class="fs-6"
                :value="item.post.title"
                :length="40"
              ></MaxSpan>
            </div>
            <div class="text-secondary sm">
              <template v-for="(tag, index) of getTags(item)" :key="index">
                <MaxSpan
                  class="fw-bold"
                  :style="{ color: tag.color }"
                  :value="tag.name"
                  :length="10"
                ></MaxSpan>

                <a-badge
                  v-if="index !== getTags(item).length - 1"
                  class="ms-2"
                  status="default"
                />
              </template>
            </div>
          </td>
          <!-- 作者 -->
          <td class="text-nowrap">
            <div>
              {{ item.user.nickname || item.user.username }}
            </div>
            <div class="text-secondary sm">
              {{ getElapsedTime(item.post.createTime) }}前
            </div>
          </td>
          <!-- 最后回复 -->
          <td class="text-nowrap">
            <template v-if="item.commentPage.records[0]?.user">
              <div>
                {{
                  item.commentPage.records[0].user.nickname ||
                  item.commentPage.records[0].user.username
                }}
              </div>
              <div class="text-secondary sm">
                {{
                  getElapsedTime(
                    item.commentPage.records[0].comment.updateTime
                  )
                }}前
              </div>
            </template>
            <template v-else> --- </template>
          </td>
          <!-- 回复和查看数量 -->
          <td class="text-nowrap">
            {{ item.post.commentCount }} /
            <span class="text-secondary sm">{{ item.post.viewCount }}</span>
          </td>

          <slot name="tail" :post="item"></slot>
        </tr>
      </template>
    </tbody>
  </table>
  <div v-else>
    <a-empty description="暂无数据"></a-empty>
  </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";

import { useRouter } from "vue-router";
import { config } from "../../store";
import { BBSPostModel } from "../../store/interface";
import { getElapsedTime } from "../../utils";
import MaxSpan from "../common/MaxSpan.vue";

interface Tag {
  name: string;
  color: string;
}

const props = defineProps<{
  posts: BBSPostModel[];
}>();

const router = useRouter();

function getTags(model: BBSPostModel): Tag[] {
  const tags = model.tags.map((t) => ({ name: t.name, color: "#6c757d" }));
  if (model.post.globalPinned) {
    // @ts-ignore
    tags.unshift(config.bbs.tag.global);
  }

  if (model.post.recommend) {
    // @ts-ignore
    tags.unshift(config.bbs.tag.recommend);
  }

  if (
    model.post.viewCount > config.bbs.post.hot_view_point ||
    model.post.commentCount > config.bbs.post.hot_comment_point
  ) {
    tags.unshift(config.bbs.tag.hot);
  }

  return tags;
}
</script>
<style scoped lang="less">
tr:hover {
  background-color: #f7f7f7af;
}

tr td:first-child {
  cursor: pointer;
}

tr th {
  padding: 4px;
}

tr td {
  padding: 4px;
  border-bottom: 1px dashed #cecece;
}
</style>
