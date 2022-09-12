<template>
  <div
    class="w-100 h-100 d-flex align-items-center justify-content-center logout"
  >
    <transition name="slide-up">
      <a-result
        v-if="success"
        class="result"
        status="success"
        title="退出成功！"
        sub-title="Python学习网 正在为您跳转到登录页..."
      >
        <template #icon>
          <Icon type="icon-check-circle" />
        </template>
      </a-result>
      <a-result
        v-else
        class="result"
        status="info"
        title="正在退出中..."
        sub-title="Python学习网 欢迎您下次的登录！"
      >
        <template #icon>
          <Icon type="icon-sync" spin />
        </template>
      </a-result>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { store } from "../../store";
import Icon from "../../components/common/Icon.vue";
import { UserApi } from "../../api";
import { ref } from "vue";
store.user = undefined;
const router = useRouter();

const success = ref(false);

UserApi.logout().then(({ data: { msg } }) => {
  success.value = true;
  setTimeout(() => router.push("/login"), 1000);
});
</script>
<style scoped lang="less">
.logout {
  display: inline-block;
  position: relative;
}

.result {
  position: absolute;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
