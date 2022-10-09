<template>
  <a-upload-dragger
    :custom-request="handleUpload"
    :before-upload="beforeUpload"
    :show-upload-list="false"
    class="rounded"
    :disabled="file !== undefined"
  >
    <div class="upload-info">
      <div class="col-12 d-flex justify-content-center">
        <div class="col-12">
          <template v-if="slots.file">
            <component :is="slots.file"></component>
          </template>
          <template v-else>
            <Icon style="font-size: 64px" type="icon-file" />
          </template>
        </div>
      </div>

      <div class="col-12">
        <template v-if="file">
          <span> {{ file.name }} </span>
          <a-button
            type="link"
            danger
            @click.stop="(file = undefined), emits('upload', undefined as any)"
          >
            删除
          </a-button>
        </template>

        <span v-else>
          {{ defaultFilename || "拖动或者点击此位置上传文件" }}
        </span>
      </div>
    </div>
  </a-upload-dragger>
</template>
<script setup lang="ts">
import { ref, useSlots } from "vue";
import Icon from "./Icon.vue";

defineProps<{
  defaultFilename?: string;
}>();
const emits = defineEmits<{
  (e: "upload", file: File): void;
}>();
const file = ref<File>();
const slots = useSlots();

function beforeUpload(f: File) {
  file.value = f;
  return true;
}

async function handleUpload() {
  if (file.value) {
    emits("upload", file.value);
  }
}
</script>
<style scoped lang="less">
.upload-info {
  display: flex;
  flex-direction: column;

  padding: 12px;
}
</style>
