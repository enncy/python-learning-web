<template>
  <video ref="video" class="video-js" controls>
    <source :src="src" :type="type" />
  </video>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

const props = defineProps<{
  type: string;
  src: string;
}>();

const video = ref<Element>();
const player = ref<VideoJsPlayer>();

onMounted(() => {
  nextTick(() => {
    if (video.value) {
      const options: VideoJsPlayerOptions = {
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
              player.value.src({
                src: props.src,
                type: props.type,
              });
              //   player.value = videojs(video.value, options);
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
<style scoped lang="less"></style>
