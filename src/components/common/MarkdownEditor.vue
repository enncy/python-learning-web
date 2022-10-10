<template>
  <div>
    <div class="mb-3 d-flex align-items-center">
      Markdown编辑器
      <a-divider type="vertical" />
      <a-button type="primary" ghost shape="round" size="small">
        使用说明 <Icon type="icon-question-circle" />
      </a-button>
      <a-divider type="vertical" />
      编辑模式：
      <a-radio-group v-model:value="editor.type" size="small">
        <a-radio-button :value="1">双栏</a-radio-button>
        <a-radio-button :value="2">源码</a-radio-button>
        <a-radio-button :value="3">预览</a-radio-button>
      </a-radio-group>

      <slot name="actions"></slot>
    </div>

    <div class="markdown">
      <div
        v-show="editor.type === 1 || editor.type === 2"
        ref="textarea"
        class="h-100 w-100"
      >
        <a-textarea
          :style="{ minHeight: height + 'px' }"
          class="markdown-editor"
          v-model:value="editor.content"
        ></a-textarea>
      </div>
      <div
        v-show="editor.type === 1 || editor.type === 3"
        ref="preview"
        class="h-100 w-100"
      >
        <MarkdownText
          :style="{ minHeight: height + 'px' }"
          class="markdown-body border rounded p-2"
          :content="editor.content"
        ></MarkdownText>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch, nextTick, computed } from "vue";
import MarkdownText from "./MarkdownText.vue";
import Icon from "./Icon.vue";

const props = withDefaults(
  defineProps<{
    content: string;
    height: number;
  }>(),
  {
    content: "",
    height: 600,
  }
);

const emits = defineEmits<{
  (e: "update:content", content: string): void;
}>();

const editor = reactive({
  type: 1,
  content: props.content,
});

const textarea = ref<HTMLDivElement>();
const preview = ref<HTMLDivElement>();

onMounted(() => {
  nextTick(() => {
    // 绑定两个栏的高度
    function outputsize() {
      if (preview.value && textarea.value) {
        const body = preview.value.querySelector(".markdown-body");
        if (textarea.value.clientHeight > 0) {
          // @ts-ignore
          body.style.height = `${textarea.value.clientHeight}px`;
        }
      }
    }
    outputsize();
    if (textarea.value) {
      new ResizeObserver(outputsize).observe(textarea.value);
    }
  });
});

watch(
  () => editor.content,
  (c) => {
    emits("update:content", c);
  }
);
</script>
<style scoped lang="less">
.markdown-editor,
.markdown-body {
  height: 100%;
  width: 100%;
  min-width: 100px;
  overflow: auto;
}

.markdown {
  height: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
