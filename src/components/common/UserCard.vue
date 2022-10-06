<template>
  <div class="d-flex">
    <div class="text-center">
      <span class="me-2">
        <Avatar shape="square" :size="theme[size].size" :user="user"></Avatar>
      </span>
    </div>
    <div class="text-center text-lg-start">
      <div :style="{ fontSize: theme[size].fontSize }">
        <span v-if="user">
          {{ user.nickname || user.username }}
        </span>
        <span v-else> 该用户不存在 </span>
      </div>
      <div>
        <span v-if="user" :style="{ fontSize: theme[size].profileSize }">
          {{ user.profile || "此用户暂无任何简介~" }}
        </span>
      </div>
      <div class="text-secondary" v-if="user">
        <span> 帖子: {{ info.postCount }} </span>
        <a-divider type="vertical" />
        <span> 积分: {{ user.credit }} </span>
        <a-divider type="vertical" />
        <span> 粉丝: {{ info.followingCount }} </span>
        <a-divider type="vertical" />
        <span> 关注: {{ info.followCount }} </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { User, UserInfo } from "../../store/interface";

withDefaults(
  defineProps<{
    user: User;
    info: UserInfo;
    size?: "small" | "default";
  }>(),
  {
    size: "default",
  }
);

const theme = ref({
  small: {
    size: 64,
    fontSize: "16px",
    profileSize: "12px",
  },
  default: {
    size: 124,
    fontSize: "36px",
    profileSize: "24px",
  },
});
</script>
<style scoped lang="less"></style>
