<template>
  <CommonLayout :no-shadow="true">
    <div class="pt-5 shadow-sm" v-if="userModel">
      <div class="d-flex flex-wrap w-100">
        <div class="col">
          <div class="d-flex justify-content-center align-items-center">
            <div class="col-lg-6 col-12 d-flex flex-wrap gy-3">
              <div class="col-lg-3 col-12 text-center">
                <span class="me-2">
                  <Avatar
                    shape="square"
                    :size="124"
                    :user="userModel.user"
                  ></Avatar>
                </span>
              </div>
              <div class="col-lg-6 col-12 text-center text-lg-start">
                <div>
                  <span class="fs-1">
                    {{ userModel.user.nickname || userModel.user.username }}
                  </span>
                </div>
                <div>
                  <span class="fs-5">
                    {{ userModel.user.profile || "此用户暂无任何简介~" }}
                  </span>
                </div>
                <div class="mt-2 text-secondary">
                  <span> 帖子: {{ userModel.postPage.total }} </span>
                  <a-divider type="vertical" />
                  <span> 积分: {{ userModel.user.credit }} </span>
                </div>
              </div>
              <div class="col-lg-3 col-12 text-center">
                <div class="p-1">
                  <a-button class="w-75" type="primary">
                    <Icon type="icon-plus" />
                    关注</a-button
                  >
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
                  <a-menu-item key="1"> 最新帖子 </a-menu-item>
                  <a-menu-item key="2"> 个人资料 </a-menu-item>
                  <a-menu-item key="3"> 他的关注 </a-menu-item>
                  <a-menu-item key="4"> 他的收藏 </a-menu-item>
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
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === '1'">
        <PostTable :posts="userModel.postPage.records"> </PostTable>
        <div class="mt-3 text-end">
          <Pagination v-model:pagination="pagination"></Pagination>
        </div>
      </div>
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === '2'">
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
          <div class="user-info">
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
      </div>
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === '3'">
        <a-empty description="暂无数据"></a-empty>
      </div>
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === '4'">
        <a-empty description="暂无数据"></a-empty>
      </div>
    </div>
  </CommonLayout>
</template>
<script setup lang="ts">
import { onMounted, reactive, Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserApi } from "../../api";
import CommonLayout from "../../layout/CommonLayout.vue";
import { store } from "../../store";
import Icon from "../../components/common/Icon.vue";
import { BBSPostModel, User, UserModel } from "../../store/interface";
import Avatar from "../../components/common/Avatar.vue";
import { getRole } from "../../utils";
import PostTable from "../../components/bbs/PostTable.vue";
import Pagination from "../../components/common/Pagination.vue";

const route = useRoute();
const userModel = ref<UserModel>();
const loginRecords = ref();
const doc = document;

const selectedKeys = ref(["1"]);

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
        page: pagination.page,
        size: pagination.size,
      }).then(({ data: { data } }) => {
        userModel.value = data;
        pagination.total = data.postPage.total;

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
</style>
