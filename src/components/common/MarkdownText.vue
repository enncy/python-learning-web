<template>
  <div class="markdown-text" v-html="md"></div>
</template>
<script setup lang="ts">
import "../../assets/css/markdown-editor.css";
import "video.js/dist/video-js.css";
import "../../assets/css/video.css";
import "../../assets/css/container.css";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import videojs, { VideoJsPlayer } from "video.js";
// @ts-ignore
import Emoji from "markdown-it-emoji";
import Anchor from "markdown-it-anchor";
import { markdownContainer } from "../../utils/markdown-container";

const props = defineProps<{
  content: string;
}>();

// @ts-ignore full options list (defaults)
const markdownIt: MarkdownIt = markdownit({
  html: false,
  xhtmlOut: false,
  breaks: true,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: "“”‘’",
  highlight: function (str, lang) {
    // @ts-ignore
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          // @ts-ignore
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' +
      markdownIt.utils.escapeHtml(str) +
      "</code></pre>"
    );
  },
});

markdownIt
  // emoji 表情
  .use(Emoji)
  // 自定义 container
  .use(markdownContainer)
  // 锚点
  .use(Anchor, {
    permalink: true,
    permalinkBefore: true,
    // 锚点标识
    permalinkSymbol: "#",
  });

const md = computed(() => markdownIt.render(props.content));

/**
 *  解析视频
 */
const players = ref<VideoJsPlayer[]>([]);

onMounted(() => {
  nextTick(() => {
    const videos = Array.from(
      document.querySelectorAll(".video-js")
    ) as HTMLElement[];
    for (const video of videos) {
      const options = {
        bigPlayButton: true,
        controls: true,
        defaultVolume: 0.5,
        playbackRates: [1, 1.5, 2],
        fluid: true,
      };
      const player = videojs(video, options);
      player.addClass("w-100");
      players.value.push(player);
    }
  });
});

onBeforeUnmount(() => {
  for (const player of players.value) {
    player.dispose();
  }
});
</script>
<style scoped lang="less"></style>
