<template>
  <CommonLayout>
    <div class="container pt-5" v-if="user">
      <div class="row g-3">
        <div class="col-2 h-100">
          <a-menu class="h-100" mode="vertical">
            <a-menu-item key="1" @click="router.push('/user/information')">
              个人资料
            </a-menu-item>
            <a-menu-item key="2" @click="router.push('/user/notify')">
              通知
            </a-menu-item>
            <a-menu-item key="3" @click="router.push('/user/message')">
              信息
            </a-menu-item>
            <a-divider />
            <a-menu-item key="4" @click="router.push('/user/bbs')">
              我的论坛
            </a-menu-item>
            <a-menu-item key="5" @click="router.push('/user/learning')">
              我的学习
            </a-menu-item>
            <a-menu-item key="6" @click="router.push('/user/oj')">
              我的题库
            </a-menu-item>
          </a-menu>
        </div>
        <div class="col-10">
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
import { Transition } from "vue";
import { useRouter } from "vue-router";
import CommonLayout from "../../layout/CommonLayout.vue";
import { store } from "../../store";

const router = useRouter();

const user = store.user;
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
