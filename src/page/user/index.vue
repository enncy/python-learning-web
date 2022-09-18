<template>
  <CommonLayout>
    <div class="page" v-if="user">
      <div class="row">
        <div class="col-lg-2 col-12 h-100">
          <a-menu class="h-100" mode="vertical">
            <a-menu-item key="1" @click="router.push('/user/information')">
              个人资料
            </a-menu-item>
            <a-menu-item
              key="2"
              @click="router.push('/user/message'), readMessage()"
            >
              <a-badge :count="user.messageCount">
                <div class="pe-3">消息</div>
              </a-badge>
            </a-menu-item>

            <a-divider />
            <a-menu-item key="3" @click="router.push('/user/bbs')">
              我的论坛
            </a-menu-item>
            <a-menu-item key="4" @click="router.push('/user/learning')">
              我的学习
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
import { onBeforeMount, ref, Transition } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "../../api";
import CommonLayout from "../../layout/CommonLayout.vue";
import { store } from "../../store";

const router = useRouter();

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
