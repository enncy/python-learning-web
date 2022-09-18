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

    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-12 col-lg-8 mb-3">
            <a-carousel class="bbs-carousel" autoplay>
              <div class="h-100"><h3>1</h3></div>
              <div class="h-100"><h3>2</h3></div>
              <div class="h-100"><h3>3</h3></div>
              <div class="h-100"><h3>4</h3></div>
            </a-carousel>
          </div>
          <div class="col-12 col-lg-4">
            <Card>
              <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="最新帖子">
                  Content of Tab Pane 1
                </a-tab-pane>
                <a-tab-pane key="2" tab="本月精华">
                  Content of Tab Pane 2
                </a-tab-pane>
                <a-tab-pane key="3" tab="今日热门">
                  Content of Tab Pane 2
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
                      <div class="col-9 col-lg-6">
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
                          <BoardAdminList :admins="categoryModel.admins" />
                        </div>
                      </div>
                      <div class="col-lg-5 d-none d-lg-block">
                        <div>1</div>
                        <div>2</div>
                      </div>
                    </div>
                  </template>
                </div>
              </Card>
            </template>
          </div>
          <div class="col-lg-4 d-none d-lg-block">
            <Card title="最新公告">
              <template v-for="model of globalPosts?.concat(globalPosts)">
                <div
                  class="notify"
                  @click="router.push('/bbs/post/' + model.post.id)"
                >
                  <MaxSpan :value="model.post.title" :length="20"></MaxSpan>
                  <span class="float-end">
                    {{ model.post.commentCount }} /
                    <span class="text-secondary sm">
                      {{ model.post.viewCount }}</span
                    >
                  </span>
                </div>
              </template>
            </Card>
            <Card> 最新资讯 </Card>
            <Card> 萌新求助 </Card>
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

const router = useRouter();
const activeKey = ref("1");
const boards = ref<BBSBoardModel[]>([]);
const globalPosts = ref<BBSPostModel[]>();

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
});
</script>
<style scoped lang="less">
.bbs-carousel {
  box-shadow: 0px 0px 8px #dfdfdf;
  border-radius: 4px;
  text-align: center;
}

.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 100%;
  line-height: 20vh;
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

.text-secondary.sm {
  font-size: 12px;
  font-weight: 100;
}

.category-title {
  cursor: pointer;
}

.notify {
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 1px dashed #dadada;
}

.notify + .notify {
  margin-top: 8px;
}
</style>
