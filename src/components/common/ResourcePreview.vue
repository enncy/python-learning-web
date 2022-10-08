<template>
  <a-image
    v-if="type.startsWith('image')"
    class="rounded resource shadow"
    :src="src"
  />

  <video
    v-else-if="type.startsWith('video')"
    ref="video"
    class="video-js"
    controls
  >
    <source :src="props.src" :type="type" />
  </video>

  <div v-else>该文件不支持预览</div>
</template>
<script setup lang="ts">
import {
  nextTick,
  onActivated,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import "video.js/dist/video-js.css";
import "../../assets/css/video.css";
import videojs, { VideoJsPlayer } from "video.js";

const props = defineProps<{
  type: string;
  src: string;
}>();

const video = ref<Element>();
const player = ref<VideoJsPlayer>();

onMounted(() => {
  nextTick(() => {
    if (video.value) {
      const options = {
        bigPlayButton: true,
        controls: true,
        defaultVolume: 0.5,
        playbackRates: [1, 1.5, 2],
        fluid: true,
      };
      player.value = videojs(video.value, options);
      player.value.addClass("w-100");
      watch(
        () => props.src,
        () => {
          nextTick(() => {
            if (player.value && video.value) {
              player.value.dispose();
              player.value = videojs(video.value, options);
            }
          });
        }
      );
    }
  });
});

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose();
  }
});
</script>
<style scoped lang="less">
.video-js {
  border-radius: 12px;
  box-shadow: 0px 0px 12px #646464;
}
.video-js video {
  border-radius: 12px;
}
</style>
