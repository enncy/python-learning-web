<template>
  <CommonLayout>
    <div class="page" v-if="user">
      <div class="row">
        <div class="col-lg-2 col-12 h-100">
          <a-menu
            class="user-information-menu h-100"
            mode="vertical"
            v-model:active-key="activeKey"
          >
            <a-menu-item
              key="information"
              @click="router.push('/user/information')"
            >
              个人资料
            </a-menu-item>
            <a-menu-item
              key="message"
              @click="router.push('/user/message'), readMessage()"
            >
              <a-badge :count="user.messageCount">
                <div class="pe-3">我的消息</div>
              </a-badge>
            </a-menu-item>

            <a-menu-item key="notify" @click="router.push('/user/notify')">
              系统通知
            </a-menu-item>

            <a-menu-item key="bbs" @click="router.push('/user/bbs')">
              我的论坛
            </a-menu-item>
            <a-menu-item key="follow" @click="router.push('/user/follow')">
              我的粉丝
            </a-menu-item>
            <a-menu-item
              key="following"
              @click="router.push('/user/following')"
            >
              我的关注
            </a-menu-item>
            <a-menu-item key="favorite" @click="router.push('/user/favorite')">
              我的收藏
            </a-menu-item>
            <a-menu-item
              key="subscribe"
              @click="router.push('/user/subscribe')"
            >
              我的订阅
            </a-menu-item>
          </a-menu>
        </div>
        <div class="col-12 col-lg-10">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </div>
    </div>
  </CommonLayout>
</template>
<script setup lang="ts">
import { ref, Transition } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "../../api";
import CommonLayout from "../../layout/CommonLayout.vue";
import { store } from "../../store";

const router = useRouter();
const currentPath = router.currentRoute.value.path;
const activeKey = ref(
  currentPath.slice(currentPath.lastIndexOf("/") + 1, currentPath.length)
);

const user = ref(store.user);

if (store.user) {
  // 更新用户信息
  UserApi.login({
    type: "password",
    username: store.user.username,
    password: store.user.password,
  }).then(({ data: { data } }) => {
    store.user = data;
    user.value = data;
  });
}

function readMessage() {
  if (user.value && store.user) {
    user.value.messageCount = 0;
    store.user.messageCount = 0;
    UserApi.readMessage();
  }
}
</script>

<style scoped lang="less">
.user-information-menu {
  background-color: inherit;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
