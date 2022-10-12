<template>
  <div>
    <TransitionGroup name="slide">
      <slot
        v-for="(item, index) of temp"
        :key="index"
        name="item"
        :item="item"
        :index="index"
      ></slot>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, TransitionGroup } from "vue";
import { sleep } from "../../utils";

const props = defineProps<{
  list: any[];
  period: number;
}>();

const emits = defineEmits<{
  (e: "show", item: any, index: number): void;
}>();

const temp = ref<any[]>([]);

onMounted(async () => {
  for (let i = 0; i < props.list.length; i++) {
    temp.value.push(props.list[i]);
    await sleep(props.period);
    nextTick(() => {
      emits("show", props.list[i], i);
    });
  }
});
</script>
<style scoped lang="less"></style>
