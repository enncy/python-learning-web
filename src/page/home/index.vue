<template>
  <CommonLayout :no-shadow="true">
    <div class="pt-5 shadow-sm" v-if="user">
      <div class="d-flex flex-wrap w-100">
        <div class="col">
          <div class="d-flex justify-content-center align-items-center">
            <div class="col-lg-6 col-12 d-flex flex-wrap gy-3">
              <div class="col-lg-3 col-12 text-center">
                <span class="me-2"> <a-avatar :size="124"></a-avatar> </span>
              </div>
              <div class="col-lg-6 col-12 text-center text-lg-start">
                <div>
                  <span class="fs-1">
                    {{ user.nickname || user.username }}
                  </span>
                </div>
                <div>
                  <span class="fs-5">
                    {{ user.profile || "此用户暂无任何简介~" }}
                  </span>
                </div>
                <div>
                  <span>111</span>
                </div>
              </div>
              <div class="col-lg-3 col-12 text-center">
                <div class="p-1">
                  <a-button class="w-75" type="primary">
                    <Icon type="icon-plus" />
                    关注</a-button
                  >
                </div>
                <div class="p-1">
                  <a-button class="w-75" type="primary" ghost>
                    <Icon type="icon-message" />
                    私信
                  </a-button>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <div class="col-lg-6 col-12 mt-3 row">
              <div class="row">
                <a-menu mode="horizontal" v-model:selectedKeys="selectedKeys">
                  <a-menu-item key="1"> 最新动态 </a-menu-item>
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
      v-if="user"
      class="d-flex flex-wrap justify-content-center align-items-center p-3"
    >
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === '1'">
        <a-empty></a-empty>
      </div>
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === '2'">
        <a-divider>基本信息</a-divider>
        <div class="user-info"><label>用户名</label> : {{ user.username }}</div>
        <div class="user-info">
          <label>昵称</label> : {{ user.nickname || "暂无昵称" }}
        </div>
        <div class="user-info">
          <label>简介</label> : {{ user.profile || "暂无简介" }}
        </div>
        <div class="user-info">
          <label>主页地址</label> : {{ doc.location.origin }}/@{{
            user.slug || user.username
          }}
        </div>

        <div class="user-info"><label>邮箱</label> : {{ user.email }}</div>
        <div class="user-info"><label>UID</label> : {{ user.id }}</div>
        <div class="user-info">
          <label>身份</label> :
          {{
            user.role === "admin"
              ? "管理员"
              : user.role === "user"
              ? "用户"
              : "游客"
          }}
        </div>
        <a-divider>活跃概况</a-divider>
        <div class="user-info">
          <label>注册时间</label> :
          {{ new Date(user.createTime).toLocaleString("zh-CN") }}
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
        <a-empty></a-empty>
      </div>
      <div class="col-lg-5 col-12" v-if="selectedKeys[0] === '4'">
        <a-empty></a-empty>
      </div>
    </div>
  </CommonLayout>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserApi } from "../../api";
import CommonLayout from "../../layout/CommonLayout.vue";
import { store } from "../../store";
import Icon from "../../components/common/Icon.vue";
import { User } from "../../store/interface";

const route = useRoute();
const user = ref<User>();
const loginRecords = ref();
const doc = document;

const selectedKeys = ref(["1"]);

onMounted(() => {
  if (route.params.usernameOrSlug === "" && store.user) {
    window.document.location.href =
      "/@" + (store.user.slug || store.user.username);
  } else {
    if (Array.isArray(route.params.usernameOrSlug)) {
      window.document.location.href = "/404";
    } else {
      // 获取信息
      UserApi.info({
        username: route.params.usernameOrSlug,
        slug: route.params.usernameOrSlug,
      }).then(({ data: { data } }) => {
        user.value = data;

        // 获取登录信息
        UserApi.loginRecord({
          id: data.id,
        }).then(({ data: { data } }) => {
          loginRecords.value = data.records;
        });
      });
    }
  }
});
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
