<template>
  <a-date-picker v-model:value="day" />
</template>
<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { ref, watch } from "vue";

const props = defineProps<{
  value: any;
}>();

const day = ref<Dayjs>();

watch(day, () => {
  console.log(day.value?.toDate().getTime());
});

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();
</script>
<style scoped lang="less"></style>
