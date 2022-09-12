<template>
  <div class="editor rounded-1 border">
    <div ref="textarea" class="textarea"></div>
  </div>
  <div>
    <div class="float-end">
      <a-button
        size="small"
        class="me-3"
        shape="round"
        @click="settingModelVisible = true"
      >
        <Icon type="icon-setting" /> 设置
      </a-button>
      <a-button size="small" shape="round" @click="informationVisible = true">
        <Icon type="icon-info-circle" /> 快捷键
      </a-button>

      <a-divider type="vertical" class="ms-3 me-3" />

      <slot name="actions"></slot>
    </div>
  </div>

  <div style="clear: both"></div>

  <SimplifyModel title="编辑器快捷键" v-model:visible="informationVisible">
    <div class="editor-option-item">
      复制 :
      <div class="float-end">Ctrl + C</div>
    </div>
    <div class="editor-option-item">
      粘贴 :
      <div class="float-end">Ctrl + V</div>
    </div>
    <div class="editor-option-item">
      全选 :
      <div class="float-end">Ctrl + A</div>
    </div>
    <div class="editor-option-item">
      搜索 :
      <div class="float-end">Ctrl + F</div>
    </div>
    <div class="editor-option-item">
      切换注释 :
      <div class="float-end">Ctrl + /</div>
    </div>
    <div class="editor-option-item">
      撤销 :
      <div class="float-end">Ctrl + Z</div>
    </div>
    <div class="editor-option-item">
      恢复 :
      <div class="float-end">Ctrl + Y</div>
    </div>
    <div class="editor-option-item">
      移动光标 :
      <div class="float-end">Ctrl + 上下左右</div>
    </div>
  </SimplifyModel>

  <SimplifyModel title="编辑器设置" v-model:visible="settingModelVisible">
    <div class="editor-option-item">
      <span>语言 :</span>
      <a-select
        class="editor-option-selector float-end"
        v-model:value="store.editor.options.language"
        :options="store.editor.languages.map((i) => ({ label: i, value: i }))"
        size="small"
      />
    </div>

    <div class="editor-option-item">
      <span>主题 :</span>
      <a-select
        class="editor-option-selector float-end"
        v-model:value="store.editor.options.theme"
        :options="store.editor.themes.map((i) => ({ label: i, value: i }))"
        size="small"
      />
    </div>

    <div class="editor-option-item">
      <span>字体大小 :</span>
      <a-select
        class="editor-option-selector float-end"
        v-model:value="store.editor.options.fontSize"
        :options="
          store.editor.fontSizeRange.map((i) => ({ label: i, value: i }))
        "
        size="small"
      />
    </div>

    <div class="editor-option-item">
      <span>缩进大小 :</span>
      <a-select
        ref="select"
        class="editor-option-selector float-end"
        v-model:value="store.editor.options.tabSize"
        :options="
          store.editor.tabSizeRange.map((i) => ({ label: i, value: i }))
        "
        size="small"
      />
    </div>
  </SimplifyModel>
</template>
<script setup lang="ts">
import { nextTick, onMounted, Ref, ref, toRaw, watch } from "vue";
import * as monaco from "monaco-editor";
import { store } from "../../../store";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import SimplifyModel from "../SimplifyModel.vue";
import Icon from "../Icon.vue";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

const textarea = ref();
const editor = ref(
  undefined
) as unknown as Ref<monaco.editor.IStandaloneCodeEditor>;

const props = defineProps<{
  modelValue: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const settingModelVisible = ref(false);
const informationVisible = ref(false);

onMounted(() => {
  nextTick(() => {
    editor.value = monaco.editor.create(textarea.value, store.editor.options);

    // 更新代码主题
    nextTick(() => {
      toRaw(editor.value).updateOptions({ theme: store.editor.options.theme });
      toRaw(editor.value).setValue(props.modelValue);
    });
    // 更改代码
    editor.value.onDidChangeModelContent((val) => {
      emits("update:modelValue", toRaw(editor.value).getValue());
    });

    // 监听语言变化，直接充值编辑器
    watch(
      () => store.editor.options.language,
      () => {
        toRaw(editor.value).dispose();
        editor.value = monaco.editor.create(
          textarea.value,
          store.editor.options
        );
      }
    );
    // 监听数值变化，更改编辑器参数
    watch(
      () => [
        store.editor.options.theme,
        store.editor.options.fontSize,
        store.editor.options.tabSize,
      ],
      () => {
        console.log([
          store.editor.options.theme,
          store.editor.options.fontSize,
          store.editor.options.tabSize,
        ]);

        toRaw(editor.value).updateOptions(store.editor.options);
      }
    );

    watch(
      () => props.modelValue,
      (v) => {
        toRaw(editor.value).setValue(v);
      }
    );
  });
});
</script>
<style scoped lang="less">
.editor {
  margin: 12px 0px;
  padding: 6px;
  resize: vertical;
  overflow: hidden;
  border: 1px solid black;
  height: 400px;
  .textarea {
    width: 100%;
    height: 100%;
  }
}

.editor-option-selector {
  min-width: 140px;
}

.editor-option-item {
  margin-bottom: 24px;
}
</style>
