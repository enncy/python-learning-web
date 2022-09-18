<template>
  <a-upload-dragger
    :fileList="fileList"
    :custom-request="handleUpload"
    :before-upload="beforeUpload"
    :show-upload-list="false"
  >
    <div
      class="d-flex flex-wrap h-100 w-100 justify-content-center align-items-center"
    >
      <div class="w-100">
        <Icon class="fs-1" type="icon-image" />
      </div>
      <p class="w-100">拖动或者点击此位置上传图片</p>
    </div>
  </a-upload-dragger>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
import { ref } from "vue";
import { store } from "../../store";
import Icon from "./Icon.vue";

const fileList = ref<File[]>([]);

const emits = defineEmits<{
  (e: "upload", files: File[]): void;
}>();

function beforeUpload(file: File) {
  fileList.value.push(file);

  if (file) {
    const isJpgOrPng = file.type.startsWith("image");
    if (!isJpgOrPng) {
      message.error("只能上传图片!");
    }
    const isLt2M = (file.size || 0) / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("文件大小不能超过10MB!");
    }
    return isJpgOrPng && isLt2M;
  }
  return true;
}

async function handleUpload() {
  emits("upload", fileList.value);
}
</script>
<style scoped lang="less"></style>
