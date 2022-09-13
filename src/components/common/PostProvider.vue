<template>
  <a-pagination
    class="mb-3 text-center"
    v-model:current="pagination.page"
    v-model:page-size="pagination.size"
    :page-size-options="['10', '20', '50', '100']"
    :total="pagination.total"
    show-size-changer
    :show-total="
        (total: number, range:any[]) => `显示 ${range[0]}-${range[1]} , 总共 ${total} 个数据`
      "
  >
    <template #buildOptionText="props">
      <div>{{ props.value }}/页</div>
    </template>
  </a-pagination>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { BBSApi } from "../../api/bbs";
import { BBSPost } from "../../store/interface";

interface Pagination {
  page: number;
  size: number;
  total: number;
}

const props = defineProps<{
  pagination: Pagination;
}>();

const emits = defineEmits<{
  (e: "update", posts: BBSPost[]): void;
}>();

watch(props.pagination, (pagination) => {
  BBSApi.listPost(pagination).then(({ data: { data } }) => {
    emits("update", data);
  });
});
</script>
<style scoped lang="less">
:deep(.ant-pagination-options .ant-select) {
  width: 100px;
}
</style>
