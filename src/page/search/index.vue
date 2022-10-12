<template>
  <CommonLayout :no-shadow="true">
    <div class="page search-page" style="min-height: 100vh">
      <Loading :loading="loading">
        <div>
          <template v-if="postModels.length">
            <span> “{{ value }}” 共有 {{ postModels.length }} 个搜索结果 </span>
            <SlideList :list="postModels" :period="50" @show="onShow">
              <template #item="{ item, index }">
                <Card
                  class="mt-3 shadow-sm"
                  :class="`search-item-${index}`"
                  @click="router.push(`/bbs/post/${item.post.id}`)"
                >
                  <div class="fs-6 mb-2">
                    <b :class="`search-result-${index}`">
                      {{ item.post.title }}
                    </b>
                  </div>
                  <div>
                    <span class="me-3">
                      <Avatar class="me-1" :user="item.user"></Avatar>
                      <span>
                        {{
                          item.user
                            ? item.user.nickname || item.user.username
                            : "已注销"
                        }}
                      </span>
                      {{ ":" }}
                    </span>
                    <MaxSpan
                      class="text-secondary"
                      :class="`search-result-${index}`"
                      :value="item.post.content"
                      :length="100"
                    ></MaxSpan>
                  </div>
                </Card>
              </template>
            </SlideList>
          </template>
          <template v-else>
            <NotFound :title="`未找到任何相关 “${value}” 的文章`"></NotFound>
          </template>
        </div>
      </Loading>
    </div>
  </CommonLayout>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
import { nextTick, onMounted, ref, watch } from "vue";
import { BBSApi } from "../../api";
import CommonLayout from "../../layout/CommonLayout.vue";
import { BBSPostModel } from "../../store/interface";
import NotFound from "../../components/common/NotFound.vue";
import Loading from "../../components/common/Loading.vue";
import SlideList from "../../components/common/SlideList.vue";
import Card from "../../components/common/Card.vue";
import MaxSpan from "../../components/common/MaxSpan.vue";
import Avatar from "../../components/common/Avatar.vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  value: string;
}>();

const postModels = ref<BBSPostModel[]>([]);
const router = useRouter();
const loading = ref(true);

onMounted(async () => {
  await render();
  watch(() => props.value, render);
});

async function render() {
  loading.value = true;
  const {
    data: { data, msg },
  } = await BBSApi.advanceSearch({
    title: props.value,
    content: props.value,
    published: true,
    banned: false,
  });

  if (data) {
    postModels.value = data.slice(0, 100);
  } else {
    message.error(msg);
  }
  loading.value = false;
}

function onShow(item: any, index: number) {
  const el = document.querySelector(
    `.search-result-${index}`
  ) as HTMLDivElement;

  if (el) {
    el.innerHTML = el.innerHTML.replace(
      RegExp(props.value, "g"),
      `<em style="background: #ffff0063">${props.value}</em>`
    );
  }
}
</script>
<style scoped lang="less">
[class*="search-item"]:hover {
  cursor: pointer;
  box-shadow: 0px 0px 12px rgba(0, 110, 255, 0.397) !important;
}
</style>
