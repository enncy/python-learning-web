<template>
  <div class="page">
    <div class="mb-3">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <Icon type="icon-home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item> 论坛首页 </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="row gy-5">
      <div class="col-12">
        <div class="row">
          <div class="col-12 col-lg-8">
            <a-carousel class="bbs-carousel" autoplay>
              <a-image
                class="cover"
                src="https://th.bing.com/th/id/OIP.uxliFnoB2YSP4pgxn5x4lwHaDn?w=316&h=170&c=7&r=0&o=5&pid=1.7"
              />
              <a-image
                class="cover"
                src="https://th.bing.com/th/id/OIP.kcmQrCp7We0AIktaA9sXzQHaEH?w=316&h=180&c=7&r=0&o=5&pid=1.7"
              />
              <a-image
                class="cover"
                src="https://th.bing.com/th/id/OIP.Q7WBbWA2IG4a-gZ-U8igDwHaC9?w=314&h=140&c=7&r=0&o=5&pid=1.7"
              />
              <a-image
                class="cover"
                src="https://th.bing.com/th/id/OIP.3y4k0uziw1hEGGGP8kyQsAHaEo?w=282&h=180&c=7&r=0&o=5&pid=1.7"
              />
            </a-carousel>
          </div>
          <div class="col-12 col-lg-4">
            <Card>
              <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="最新帖子">
                  <PostList :posts="latestPosts"></PostList>
                </a-tab-pane>
                <a-tab-pane key="2" tab="本月精华">
                  <PostList :posts="recommends"></PostList>
                </a-tab-pane>
                <a-tab-pane key="3" tab="今日热门">
                  <a-empty></a-empty>
                </a-tab-pane>
              </a-tabs>
            </Card>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="row">
          <div class="col-12 col-lg-8">
            <template v-for="boardModel of boards" :key="boardModel.board.id">
              <Card>
                <h3 class="border-bottom pb-2">
                  <b>
                    <a-badge color="#108ee9" /> {{ boardModel.board.name }}
                  </b>
                </h3>

                <div class="p-2">
                  <template
                    v-for="(categoryModel, index) of boardModel.categories"
                    :key="boardModel.name + categoryModel.category.id"
                  >
                    <div class="category row">
                      <div class="col-3 col-lg-1">
                        <a-avatar shape="square" :size="42"></a-avatar>
                      </div>
                      <div class="col-9 col-lg-3">
                        <div
                          class="category-title"
                          @click="
                            router.push(
                              `/bbs/category/${categoryModel.category.id}`
                            )
                          "
                        >
                          <div class="fw-bold">
                            {{ categoryModel.category.name }}
                            <span class="text-secondary sm"
                              >({{ categoryModel.postPage.total }})</span
                            >
                          </div>
                          <div class="text-secondary sm">
                            <MaxSpan
                              :value="categoryModel.category.description"
                              :length="50"
                            ></MaxSpan>
                          </div>
                        </div>

                        <div class="text-secondary sm">
                          版主：
                          <template v-if="categoryModel.admins.length">
                            <BoardAdminList :admins="categoryModel.admins" />
                          </template>
                          <template v-else>暂无</template>
                        </div>
                      </div>
                      <div
                        class="col-lg-8 d-none d-lg-block category-post"
                        @click="
                          router.push(
                            '/bbs/post/' +
                              categoryModel.postPage.records[0].post.id
                          )
                        "
                      >
                        <div>
                          <MaxSpan
                            :value="
                              categoryModel.postPage.records[0].post.title
                            "
                            :length="50"
                          ></MaxSpan>
                        </div>
                        <div class="text-secondary sm">
                          {{
                            getElapsedTime(
                              categoryModel.postPage.records[0].post.createTime
                            )
                          }}前 -
                          {{
                            categoryModel.postPage.records[0].user.nickname ||
                            categoryModel.postPage.records[0].user.username
                          }}
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </Card>
            </template>
          </div>
          <div class="col-lg-4 d-none d-lg-block">
            <Card title="最新公告">
              <PostList :posts="globalPosts"></PostList>
            </Card>
            <Card title="最新资讯">
              <PostList :posts="news"></PostList>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import Card from "../../components/common/Card.vue";
import { useRouter } from "vue-router";
import { BBSApi } from "../../api/bbs";
import { BBSBoardModel, BBSPostModel } from "../../store/interface";
import Icon from "../../components/common/Icon.vue";
import MaxSpan from "../../components/common/MaxSpan.vue";
import BoardAdminList from "../../components/bbs/BoardAdminList.vue";
import { getElapsedTime } from "../../utils";
import PostList from "../../components/bbs/PostList.vue";

const router = useRouter();
const activeKey = ref("1");
const boards = ref<BBSBoardModel[]>([]);
// 最新公告
const globalPosts = ref<BBSPostModel[]>([]);
// 最新新闻
const news = ref<BBSPostModel[]>([]);
// 最新帖子
const latestPosts = ref<BBSPostModel[]>([]);
// 精华帖
const recommends = ref<BBSPostModel[]>([]);

onMounted(() => {
  BBSApi.listBoard().then(({ data: { data } }) => {
    boards.value = data;
  });

  // 获取全局公告
  BBSApi.listGlobalPosts({ page: 1, size: 5 }).then(({ data: { data } }) => {
    if (data) {
      globalPosts.value = data;
    }
  });

  BBSApi.advanceSearch({
    categoryName: "新闻咨询",
  }).then(({ data: { data } }) => {
    news.value = data;
  });

  BBSApi.advanceSearch({
    recommend: true,
  }).then(({ data: { data } }) => {
    recommends.value = data;
  });

  BBSApi.listPostModel({ page: 1, size: 5 }).then(({ data: { data } }) => {
    latestPosts.value = data;
  });
});
</script>
<style scoped lang="less">
.bbs-carousel {
  box-shadow: 0px 0px 8px #dfdfdf;
  border-radius: 4px;
  text-align: center;
}

.ant-carousel :deep(.slick-slide) {
  border-radius: 4px;
  text-align: center;
  overflow: hidden;
}

.ant-carousel :deep(li button) {
  height: 8px;
  border-radius: 4px;
  box-shadow: 0px 0px 4px #000000;
}

:deep(.ant-badge-status-dot) {
  width: 6px;
  height: 16px;
  border-radius: 4px;
}

:deep(.ant-badge-status-text) {
  margin-left: 0px;
}

.category {
  padding: 12px 0px;
}

.category + .category {
  border-top: 1px dashed #dbdbdb;
}

.category-title {
  cursor: pointer;
}
.category-post {
  cursor: pointer;
}

:deep(.ant-image) {
  width: 100% !important;
}
:deep(img) {
  object-fit: cover !important;
  width: 100% !important;
  height: 260px !important;
  border-radius: 4px !important;
}
</style>
