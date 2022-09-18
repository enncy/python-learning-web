<template>
  <a-avatar
    class="user-avatar"
    v-if="user"
    @click="router.push('/@' + (user?.slug || user?.username))"
    :src="`${config.baseURL}/avatar?id=${user.id}`"
  ></a-avatar>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { config } from "../../store";
import { User } from "../../store/interface";

const router = useRouter();

defineProps<{
  user?: User;
}>();
</script>
<style scoped lang="less">
.user-avatar {
  cursor: pointer;
}
</style>
