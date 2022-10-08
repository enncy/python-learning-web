<template>
  <UploadResource
    :default-filename="
      props.entity
        ? `${props.entity?.filename} ( ${props.entity?.originalName} )`
        : ''
    "
    @upload="onUpload"
  >
    <template #file>
      <div class="rounded" v-if="resource">
        <ResourcePreview
          :type="resource.type"
          :src="createObjectURL(resource)"
        ></ResourcePreview>
      </div>
      <div class="rounded" v-else-if="entity.originalName">
        <ResourcePreview :type="entity.type" :src="src"></ResourcePreview>
      </div>

      <Icon v-else type="icon-file" style="font-size: 64px"> </Icon>
    </template>
  </UploadResource>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Schema, SystemResource } from "../../../store/interface";
import UploadResource from "../UploadResource.vue";
import Icon from "../Icon.vue";
import ResourcePreview from "../ResourcePreview.vue";
import { ResourceApi } from "../../../api";

const props = defineProps<{
  entity: SystemResource & {
    id: string;
  };
  schema: Schema;
  value: any;
}>();

const emits = defineEmits<{
  (e: "update:value", value: any): void;
}>();

const src = ref(props.entity.id ? ResourceApi.of({ id: props.entity.id }) : "");
const resource = ref<File>();

function onUpload(file: File) {
  resource.value = file;
  emits("update:value", file);
  if (file) {
    if (file.type.startsWith("image")) {
      props.entity.folder = "image";
    } else if (file.type.startsWith("video")) {
      props.entity.folder = "video";
    } else {
      props.entity.folder = "other";
    }
  }
}

function createObjectURL(file: Blob) {
  return URL.createObjectURL(file);
}
</script>
<style scoped lang="less"></style>
