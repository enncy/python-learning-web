<template>
  <div class="header justify-content-lg-center justify-content-start">
    <template v-for="(item, index) of config.headers" :key="index">
      <div :class="item.class">
        <component :is="item.component"></component>
        <div
          v-if="item.path"
          class="item"
          @click="router.push(item.path)"
          :class="{
            active:
              item.name === route.name ||
              route.matched.some((m) => m.meta.name === item.name),
          }"
        >
          <span> {{ item.name }} </span>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { config } from "../../store";
const route = useRoute();

const router = useRouter();
</script>
<style scoped lang="less">
.item {
  display: inline;
  padding: 12px;

  &.active {
    color: #1890ff;
  }

  &:hover {
    cursor: pointer;
  }
}

.header {
  height: 48px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}
</style>
