<template>
  <a-avatar
    class="user-avatar"
    v-if="user"
    @click="go('/@' + (user?.slug || user?.username))"
    :src="ResourceApi.of({ id: user.id })"
  ></a-avatar>
  <a-avatar v-else></a-avatar>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { ResourceApi } from "../../api";
import { config } from "../../store";
import { User } from "../../store/interface";

const router = useRouter();

defineProps<{
  user?: User;
}>();

function go(href: string) {
  window.open(href, "_blank");
}
</script>
<style scoped lang="less">
.user-avatar {
  cursor: pointer;
}
</style>
