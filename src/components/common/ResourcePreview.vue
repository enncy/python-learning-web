<template>
  <a-image
    v-if="type.startsWith('image')"
    class="rounded resource shadow"
    :src="src"
  />

  <VideoJS v-else-if="type.startsWith('video')" :src="props.src" :type="type" />

  <div v-else>该文件不支持预览</div>
</template>
<script setup lang="ts">
import VideoJS from "./VideoJS.vue";

const props = defineProps<{
  type: string;
  src: string;
}>();
</script>
<style scoped lang="less"></style>
