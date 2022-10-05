<template>
  <div>
    <div v-if="notifies?.length">
      <template v-for="notify of notifies">
        <div
          class="notify p-2 bg-white rounded shadow-sm"
          @click="router.push('/bbs/post/' + notify.postId)"
        >
          <div class="border-bottom">
            📢 <b>{{ notify.title }}</b>
          </div>
          <div>
            {{ notify.content }}
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      <a-empty></a-empty>
    </div>
    <div class="mt-3 text-center">
      <Pagination v-model:pagination="pagination"></Pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { UserApi } from "../../api";
import { UserNotify } from "../../store/interface";
import Card from "../../components/common/Card.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

const notifies = ref<UserNotify[]>();

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
  UserApi.listNotify({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      notifies.value = data.records;
      pagination.total = data.total;
    }
  );
}
</script>
<style scoped lang="less">
.notify {
  cursor: pointer;
}
.notify + .notify {
  margin-top: 12px;
}
</style>
