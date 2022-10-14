<template>
  <div class="toc">
    <div class="mb-2 border-bottom">
      <b>目录</b>
    </div>
    <template v-for="anchor of anchors">
      <div :style="{ marginLeft: (anchor.level - 1) * 20 + 'px' }">
        <a :href="`#${anchor.id}`" class="text-secondary anchor">
          {{ anchor.title }}
        </a>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  anchors: {
    id: string;
    title: string;
    level: number;
  }[];
}>();
</script>
<style scoped lang="less">
.anchor {
  text-decoration: underline;
}

.toc {
  position: sticky;
  top: 20px;
  height: min-content;
}
</style>
