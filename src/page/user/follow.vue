<template>
  <Card>
    <div v-if="follows?.length">
      <template v-for="follow of follows">
        <UserCard
          class="card"
          size="small"
          :user="follow.user"
          :info="follow.userInfo"
        ></UserCard>
      </template>
    </div>
    <div v-else>
      <a-empty></a-empty>
    </div>
  </Card>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { UserApi } from "../../api";
import { UserFollowModel } from "../../store/interface";
import UserCard from "../../components/common/UserCard.vue";

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

const follows = ref<UserFollowModel[]>();

watch(
  () => [pagination.page, pagination.size],
  () => {
    renderData();
  }
);

onMounted(() => {
  renderData();
});

function renderData() {
  UserApi.listFollow({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      follows.value = data.records;
      pagination.total = data.total;
    }
  );
}
</script>
<style scoped lang="less">
.card + .card {
  margin-top: 12px;
}
</style>
