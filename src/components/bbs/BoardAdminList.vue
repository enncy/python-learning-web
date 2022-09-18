<template>
  <template v-for="admin of admins" :key="admin.id">
    <a
      class="category-admin"
      @click="router.push('/@' + (admin.slug || admin.username))"
    >
      {{ admin.nickname || admin.username }}
    </a>
    <a-divider type="vertical" />
  </template>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { BBSBoard, User } from "../../store/interface";

defineProps<{
  admins: User[];
}>();

const router = useRouter();
</script>
<style scoped lang="less">
.category-admin {
  font-size: 12px;
  cursor: pointer;
}
</style>
