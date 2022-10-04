<template>
  <Card>
    <div v-if="followings?.length">
      <template v-for="following of followings">
        <UserCard
          class="card"
          size="small"
          :user="following.following"
          :info="following.followingInfo"
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

const followings = ref<UserFollowModel[]>();

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
  UserApi.listFollowing({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      followings.value = data.records;
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
