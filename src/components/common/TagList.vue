<template>
  <div>
    <template v-for="(tag, index) in state.tags" :key="tag">
      <a-tooltip v-if="tag.length > 20" :title="tag">
        <a-tag :closable="true" @close="handleClose(tag)">
          {{ `${tag.slice(0, 20)}...` }}
        </a-tag>
      </a-tooltip>
      <a-tag v-else :closable="true" @close="handleClose(tag)">
        {{ tag }}
      </a-tag>
    </template>
    <a-input
      v-if="state.inputVisible"
      ref="inputRef"
      v-model:value="state.inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag
      v-else
      style="background: #fff; border-style: dashed"
      @click="showInput"
    >
      + 新增标签
    </a-tag>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";

const props = defineProps<{
  tags: string[];
}>();

const emits = defineEmits<{
  (e: "update:tags", tags: string[]): void;
}>();

const inputRef = ref();
const state = reactive({
  tags: props.tags,
  inputVisible: false,
  inputValue: "",
});

const handleClose = (removedTag: string) => {
  const tags = state.tags.filter((tag) => tag !== removedTag);
  console.log(tags);
  state.tags = tags;
};

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  let tags = state.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }

  emits("update:tags", tags);

  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: "",
  });
};
</script>
<style scoped lang="less"></style>
