<template>
  <div class="markdown-text" v-html="md"></div>
</template>
<script setup lang="ts">
import "../../assets/css/markdown-editor.css";
import { computed } from "vue";

const props = defineProps<{
  content: string;
}>();

// @ts-ignore full options list (defaults)
const markdownIt: MarkdownIt = markdownit({
  html: true,
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

const md = computed(() => markdownIt.render(props.content));
</script>
<style scoped lang="less"></style>
