<template>
  <CommonLayout :no-shadow="true" v-if="userModel && userInfo">
    <div class="pt-5 shadow-sm bg-white" v-if="userModel">
      <div class="d-flex flex-wrap w-100">
        <div class="col">
          <div class="d-flex justify-content-center align-items-center">
            <div class="col-lg-6 col-12 d-flex flex-wrap gy-3">
              <UserCard
                class="col-lg-9 col-12"
                :user="userModel.user"
                :info="userInfo"
              ></UserCard>
              <div class="col-lg-3 col-12 text-center">
                <div class="p-1">
                  <a-button
                    class="w-75"
                    :type="userInfo.followed ? 'default' : 'primary'"
                    @click="follow"
                  >
                    <Icon
                      :type="userInfo.followed ? 'icon-minus' : 'icon-plus'"
                    ></Icon>
                    {{ userInfo.followed ? "取消关注" : "关注" }}
                  </a-button>
                </div>
                <!-- <div class="p-1">
                  <a-button class="w-75" type="primary" ghost>
                    <Icon type="icon-message" />
                    私信
                  </a-button>
                </div> -->
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <div class="col-lg-6 col-12 mt-3 row">
              <div class="row">
                <a-menu mode="horizontal" v-model:selectedKeys="selectedKeys">
                  <a-menu-item key="profile" @click="switchTab('profile')">
                    个人资料
                  </a-menu-item>
                  <a-menu-item key="post" @click="switchTab('post')">
                    最新帖子
                  </a-menu-item>
                  <a-menu-item key="follow" @click="switchTab('follow')">
                    他的粉丝
                  </a-menu-item>
                  <a-menu-item key="following" @click="switchTab('following')">
                    他的关注
                  </a-menu-item>
                  <a-menu-item key="favorite" @click="switchTab('favorite')">
                    他的收藏
                  </a-menu-item>
                  <a-menu-item key="subscribe" @click="switchTab('subscribe')">
                    他的订阅
                  </a-menu-item>
                </a-menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="userModel"
      class="d-flex flex-wrap justify-content-center align-items-center p-3"
    >
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === 'profile'">
        <Card class="pt-1">
          <a-divider>基本信息</a-divider>
          <div class="user-info">
            <label>用户名</label> : {{ userModel.user.username }}
          </div>
          <div class="user-info">
            <label>昵称</label> : {{ userModel.user.nickname || "暂无昵称" }}
          </div>
          <div class="user-info">
            <label>简介</label> : {{ userModel.user.profile || "暂无简介" }}
          </div>
          <div class="user-info">
            <label>主页地址</label> : {{ doc.location.origin }}/@{{
              userModel.user.slug || userModel.user.username
            }}
          </div>
          <div class="user-info">
            <label>邮箱</label> : {{ userModel.user.email }}
          </div>
          <div class="user-info">
            <label>UID</label> : {{ userModel.user.id }}
          </div>
          <div class="user-info">
            <label>身份</label> :
            {{ getRole(userModel.user.role).desc }}
          </div>
        </Card>

        <Card class="pt-1">
          <a-divider>活跃概况</a-divider>
          <div class="user-info">
            <label>注册时间</label> :
            {{ new Date(userModel.user.createTime).toLocaleString("zh-CN") }}
          </div>
          <template v-if="loginRecords.length">
            <div class="user-info">
              <label>最近登录</label> :
              {{ new Date(loginRecords[0].createTime).toLocaleString("zh-CN") }}
            </div>
            <div class="user-info" v-if="loginRecords[1]">
              <label>上次登录</label> :
              {{ new Date(loginRecords[1].createTime).toLocaleString("zh-CN") }}
            </div>
            <div class="user-info">
              <label>登录IP</label> :
              {{ loginRecords[0].ip }}
            </div>
            <div class="user-info">
              <label>登录地点</label> :
              {{
                loginRecords[0].country +
                loginRecords[0].province +
                loginRecords[0].city +
                loginRecords[0].district
              }}
            </div>
          </template>
        </Card>
      </div>

      <!-- 我的帖子 -->
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === 'post'">
        <PostTable :posts="userModel.postModelPage.records"> </PostTable>
        <div class="mt-3 text-center">
          <Pagination v-model:pagination="postPagination"></Pagination>
        </div>
      </div>

      <!-- 我的粉丝 -->
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === 'follow'">
        <div v-if="userModel.followingModelPage.records.length">
          <template v-for="following of userModel.followingModelPage.records">
            <UserCard
              class="follow-card"
              size="small"
              :user="following.user"
              :info="following.userInfo"
            ></UserCard>
          </template>
        </div>
        <a-empty v-else description="暂无数据"></a-empty>
        <div class="mt-3 text-center">
          <Pagination v-model:pagination="followingPagination"></Pagination>
        </div>
      </div>

      <!-- 我的关注 -->
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === 'following'">
        <div v-if="userModel.followModelPage.records.length">
          <template v-for="follow of userModel.followModelPage.records">
            <UserCard
              class="following-card"
              size="small"
              :user="follow.following"
              :info="follow.followingInfo"
            ></UserCard>
          </template>
        </div>

        <a-empty v-else description="暂无数据"></a-empty>
        <div class="mt-3 text-center">
          <Pagination v-model:pagination="followPagination"></Pagination>
        </div>
      </div>

      <!-- 我的收藏 -->
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === 'favorite'">
        <div v-if="userModel.favoriteModelPage.records.length">
          <PostTable
            :posts="userModel.favoriteModelPage.records.map((r) => r.postModel)"
          >
          </PostTable>
        </div>

        <a-empty v-else description="暂无数据"></a-empty>

        <div class="mt-3 text-center">
          <Pagination v-model:pagination="favoritePagination"></Pagination>
        </div>
      </div>

      <!-- 我的订阅 -->
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === 'subscribe'">
        <div v-if="userModel.subscribeModelPage.records.length">
          <CategoryList
            :category-models="
              userModel.subscribeModelPage.records.map((r) => r.categoryModel)
            "
          ></CategoryList>
        </div>

        <a-empty v-else description="暂无数据"></a-empty>
      </div>
    </div>
  </CommonLayout>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { UserApi } from "../../api";
import CommonLayout from "../../layout/CommonLayout.vue";
import { store } from "../../store";
import Icon from "../../components/common/Icon.vue";
import { UserInfo, UserModel } from "../../store/interface";
import Avatar from "../../components/common/Avatar.vue";
import { getRole } from "../../utils";
import PostTable from "../../components/bbs/PostTable.vue";
import Pagination from "../../components/common/Pagination.vue";
import Card from "../../components/common/Card.vue";
import { router } from "../../router";
import UserCard from "../../components/common/UserCard.vue";
import { message } from "ant-design-vue";
import CategoryList from "../../components/bbs/CategoryList.vue";

const route = useRoute();
const userModel = ref<UserModel>();
const userInfo = ref<UserInfo>();
const loginRecords = ref<any>([]);
const doc = document;

const selectedKeys = ref([
  new URLSearchParams(document.location.search).get("tab") || "profile",
]);

const postPagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});
const followPagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});
const followingPagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});
const favoritePagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});
const subscribePagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

watch(
  () => [
    postPagination.page,
    postPagination.size,
    followPagination.page,
    followPagination.size,
    favoritePagination.page,
    favoritePagination.size,
    subscribePagination.page,
    subscribePagination.size,
  ],
  () => {
    renderData();
  }
);

onMounted(() => {
  renderData();
});

function renderData() {
  if (route.params.usernameOrSlug === "" && store.user) {
    window.document.location.href =
      "/@" + (store.user.slug || store.user.username);
  } else {
    if (Array.isArray(route.params.usernameOrSlug)) {
      window.document.location.href = "/404";
    } else {
      // 获取信息
      UserApi.model({
        username: route.params.usernameOrSlug,
        slug: route.params.usernameOrSlug,
        postPage: postPagination.page,
        postSize: postPagination.size,
        followPage: followPagination.page,
        followSize: followPagination.size,
        followingPage: followingPagination.page,
        followingSize: followingPagination.size,
        favoritePage: favoritePagination.page,
        favoriteSize: favoritePagination.size,
        subscribePage: subscribePagination.page,
        subscribeSize: subscribePagination.size,
      }).then(({ data: { data } }) => {
        userModel.value = data;
        postPagination.total = data.postModelPage.total;
        followPagination.total = data.followModelPage.total;
        followingPagination.total = data.followingModelPage.total;
        favoritePagination.total = data.favoriteModelPage.total;
        subscribePagination.total = data.subscribeModelPage.total;

        UserApi.userInfo({ id: userModel.value.user.id }).then(
          ({ data: { data } }) => {
            userInfo.value = data;
          }
        );

        // 获取登录信息
        UserApi.loginRecord({
          id: data.user.id,
        }).then(({ data: { data } }) => {
          loginRecords.value = data;
        });
      });
    }
  }
}

async function follow() {
  if (userModel.value && userInfo.value) {
    if (userInfo.value.followed) {
      userInfo.value.followed = false;
      const {
        data: { data, msg },
      } = await UserApi.cancelFollow({ id: userModel.value.user.id });
      data ? message.success(msg) : message.error(msg);
    } else {
      userInfo.value.followed = true;
      const {
        data: { data, msg },
      } = await UserApi.follow({ id: userModel.value.user.id });
      data ? message.success(msg) : message.error(msg);
    }
  }
}

function switchTab(key: string) {
  const search = new URLSearchParams(document.location.search);
  search.set("tab", key);
  router.replace(location.pathname + "?" + search.toString());
}
</script>
<style scoped lang="less">
.user-info {
  padding: 4px;

  label {
    font-weight: bold;
    width: 64px;
    display: inline-block;
  }
}

.follow-card + .follow-card {
  margin-top: 12px;
}

.following-card + .following-card {
  margin-top: 12px;
}
</style>
