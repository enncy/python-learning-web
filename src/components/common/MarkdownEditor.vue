<template>
  <div>
    <div class="mb-3 d-flex align-items-center">
      Markdown编辑器
      <a-divider type="vertical" />
      <a-button type="primary" ghost shape="round" size="small">
        使用说明 <Icon type="icon-question-circle" />
      </a-button>
      <a-divider type="vertical" />
      <a-switch
        v-model:checked="editor.doubleLayout"
        checked-children="双栏"
        un-checked-children="源码"
      ></a-switch>
      <slot name="actions"></slot>
    </div>

    <div class="markdown">
      <div ref="textarea" class="h-100 w-100">
        <a-textarea
          class="markdown-editor"
          v-model:value="editor.content"
        ></a-textarea>
      </div>
      <div v-show="editor.doubleLayout" ref="preview" class="h-100 w-100">
        <MarkdownText
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

const props = defineProps<{
  content: string;
}>();

const emits = defineEmits<{
  (e: "update:content", content: string): void;
}>();

const editor = reactive({
  doubleLayout: true,
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
        // @ts-ignore
        body.style.height = `${textarea.value.clientHeight}px`;
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
  min-height: 100px;
  overflow: auto;
}

.markdown {
  height: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
