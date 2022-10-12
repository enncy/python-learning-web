<template>
  <div class="page" v-if="categoryModel">
    <div class="mb-3">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <Icon type="icon-home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item @click="router.push('/bbs/board')">
          论坛首页
        </a-breadcrumb-item>
        <a-breadcrumb-item
          @click="router.push('/bbs/board#' + categoryModel!.board.id)"
        >
          {{ categoryModel.board.name }}
        </a-breadcrumb-item>
        <a-breadcrumb-item
          @click="router.push('/bbs/category/' + categoryModel!.category.id)"
        >
          {{ categoryModel.category.name }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <Card class="mb-3">
      <div class="d-flex">
        <div style="width: 124px; margin-right: 16px">
          <a-avatar
            v-if="categoryModel?.category.id"
            shape="square"
            :size="124"
            :src="ResourceApi.of({ id: categoryModel.category.id })"
          ></a-avatar>
        </div>
        <div style="width: calc(100% - 150px)">
          <div class="d-flex mb-3 border-bottom">
            <div class="d-flex align-items-baseline col-6">
              <h2 class="mb-0">{{ categoryModel.category.name }}</h2>
              <span class="text-secondary sm">
                <a-divider type="vertical" />
                {{
                  dayjs(categoryModel.category.createTime).format("YYYY-MM-DD")
                }}
                创建

                <a-divider type="vertical" />
                标签: 1
              </span>
            </div>
            <div class="d-flex col-6 justify-content-end">
              <a-space>
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  @click="updateModelVisible = true"
                >
                  <Icon type="icon-edit" /> 修改简介
                </a-button>
                <a-button type="primary" ghost size="small" @click="subscribe">
                  + 订阅
                </a-button>

                <a-button
                  type="primary"
                  size="small"
                  @click="router.push('/bbs/new/' + categoryModel!.category.id)"
                >
                  + 发布帖子
                </a-button>
              </a-space>
            </div>
          </div>
          <div>
            版主：
            <BoardAdminList
              v-if="categoryModel.admins.length"
              :admins="categoryModel.admins"
            />
            <span v-else>暂无</span>
          </div>
          <div class="mt-2">
            <MarkdownText
              :content="categoryModel.category.description"
            ></MarkdownText>
          </div>
        </div>
      </div>
    </Card>

    <!-- 显示全局公告 -->

    <Card title="📢全局公告">
      <PostTable :posts="globalPosts"> </PostTable>
    </Card>

    <!-- 分区内文章 -->

    <Card title="📰区内文章">
      <div class="mb-3">
        <a-input-search
          size="small"
          v-model:value="search.title"
          placeholder="搜索分区内的文章"
          style="width: 200px"
          @search="onSearch"
        />
        <a-divider type="vertical" />
        <a-switch
          v-model:checked="search.recommendOnly"
          checked-children="只看精华"
          un-checked-children="只看精华"
        ></a-switch>
        <a-divider type="vertical" />

        <a-select
          size="small"
          style="width: 100px"
          v-model:value="search.timeRanges"
          :options="
            [
              [0, '全部时间'],
              [1, '今天内'],
              [3, '三天内'],
              [7, '一周内'],
              [30, '一月内'],
              [180, '半年内'],
              [365, '一年内'],
            ].map((i) => ({ label: i[1], value: i[0] }))
          "
        >
        </a-select>
        <a-divider type="vertical" />

        <a-select size="small" v-model:value="search.orderBy">
          <a-select-option key="1" value="timeDescOrder"
            >最新帖子</a-select-option
          >
          <a-select-option key="2" value="timeAscOrder"
            >发布最久</a-select-option
          >
          <a-select-option key="3" value="mostView">最多浏览</a-select-option>
          <a-select-option key="4" value="mostComment"
            >最多回复</a-select-option
          >
        </a-select>
      </div>

      <PostTable :posts="posts">
        <template #head>
          <th
            v-if="
              store.user &&
              getRole(store.user.role).level >= getRole('root').level
            "
          >
            操作
          </th>
        </template>
        <template #tail="{ post }">
          <td
            v-if="
              store.user &&
              getRole(store.user.role).level >= getRole('root').level
            "
          >
            <a-space>
              <a-button
                type="primary"
                size="small"
                @click="recommend(post.post.id)"
              >
                精华
              </a-button>
              <a-popconfirm
                title="确定封禁此帖子吗？"
                okText="确实"
                cancelText="取消"
                @confirm="ban(post.post.id)"
              >
                <a-button size="small" type="primary" danger> 封禁 </a-button>
              </a-popconfirm>
            </a-space>
          </td>
        </template>
      </PostTable>

      <Pagination class="mt-5 text-end" v-model:pagination="search" />
    </Card>

    <SimplifyModel
      v-model:visible="updateModelVisible"
      title="修改简介"
      :width="1200"
    >
      <MarkdownEditor
        :height="600"
        v-model:content="description"
      ></MarkdownEditor>
      <div class="d-flex justify-content-end mt-3">
        <a-space>
          <a-button @click="updateModelVisible = false"> 取消 </a-button>
          <a-button type="primary" @click="updateCategory(description)">
            修改
          </a-button>
        </a-space>
      </div>
    </SimplifyModel>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BBSApi } from "../../api/bbs";
import Card from "../../components/common/Card.vue";
import { BBSCategoryModel } from "../../store/interface";
import Icon from "../../components/common/Icon.vue";
import dayjs from "dayjs";
import { BBSPostModel } from "../../store/interface";
import BoardAdminList from "../../components/bbs/BoardAdminList.vue";
import PostTable from "../../components/bbs/PostTable.vue";
import Pagination from "../../components/common/Pagination.vue";
import { ResourceApi, UserApi } from "../../api";
import { message } from "ant-design-vue";
import { store } from "../../store";
import { getRole } from "../../utils";
import SimplifyModel from "../../components/common/SimplifyModel.vue";
import MarkdownEditor from "../../components/common/MarkdownEditor.vue";
import MarkdownText from "../../components/common/MarkdownText.vue";

const route = useRoute();
const router = useRouter();

const posts = ref<BBSPostModel[]>([]);
const globalPosts = ref<BBSPostModel[]>([]);
const categoryModel = ref<BBSCategoryModel>();
/** 帖子搜索 */
const search = reactive({
  /**
   * mostView: 观看数量排序
   * mostComment: 评论数量排序
   * timeDescOrder: 最新发布排序
   * timeAscOrder: 发布最久排序
   */
  orderBy: "timeDescOrder",

  /** 标题筛选 */
  title: "",
  /** 精华筛选 */
  recommendOnly: 0,
  /** 时间筛选， 0为全部时间段 */
  timeRanges: 0,
  /** 以下为必要参数 */
  categoryId: "",
  page: 1,
  size: 10,
  total: 10,
});

const updateModelVisible = ref(false);
const description = ref("");

onMounted(async () => {
  await renderData();
  // 监听变化
  watch(search, () => {
    renderData();
  });
});

async function renderData() {
  if (
    route.params.categoryId === undefined ||
    Array.isArray(route.params.categoryId)
  ) {
    useRouter().push("/404");
  } else {
    search.categoryId = route.params.categoryId;

    // 获取文章列表
    const {
      data: { data },
    } = await BBSApi.getCategoryModel(search);
    if (data) {
      categoryModel.value = data;
      posts.value = data.postPage.records;
      search.total = data.postPage.total;
      description.value = data.category.description;
    }

    // 获取全局公告
    BBSApi.listGlobalPosts({ page: 1, size: 5 }).then(({ data: { data } }) => {
      if (data) {
        globalPosts.value = data;
      }
    });
  }
}

async function subscribe() {
  if (categoryModel.value) {
    const {
      data: { data, msg },
    } = await UserApi.subscribe({ id: categoryModel.value.category.id });
    data ? message.success(msg) : message.error(msg);
  }
}
function ban(postId: string) {
  BBSApi.banPost({ id: postId }).then(({ data: { data, msg } }) => {
    data ? message.success(msg) : message.error(msg);
  });
}

function recommend(postId: string) {
  BBSApi.recommend({ id: postId }).then(({ data: { data, msg } }) => {
    data ? message.success(msg) : message.error(msg);
  });
}

function onSearch() {}

/** 修改分区简介 */
function updateCategory(description: string) {
  if (categoryModel.value) {
    BBSApi.updateCategory({
      id: categoryModel.value.category.id,
      description: description,
    }).then(({ data: { data, msg } }) => {
      if (data && categoryModel.value) {
        categoryModel.value.category.description = description;
        updateModelVisible.value = false;
      } else {
        message.error(msg);
      }
    });
  }
}
</script>
<style scoped lang="less">
.text-secondary.sm {
  font-size: 12px;
  font-weight: 100;
}

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
}

tr td {
  border-top: 1px dashed #cecece;
}
</style>
