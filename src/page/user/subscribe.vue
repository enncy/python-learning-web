<template>
  <Card>
    <div v-if="subscribes?.length">
      <CategoryList
        :category-models="subscribes.map((s) => s.categoryModel)"
      ></CategoryList>
    </div>
    <div v-else>
      <a-empty></a-empty>
    </div>
  </Card>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { UserApi } from "../../api";
import { UserSubscribeModel } from "../../store/interface";
import Card from "../../components/common/Card.vue";

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

const subscribes = ref<UserSubscribeModel[]>();

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
  UserApi.listSubscribe({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      subscribes.value = data.records;
      pagination.total = data.total;
    }
  );
}
</script>
<style scoped lang="less"></style>
