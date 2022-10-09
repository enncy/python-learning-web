<template>
  <UploadResource
    :default-filename="
      props.entity?.originalName
        ? `${props.entity?.filename} ( ${props.entity?.originalName} )`
        : ''
    "
    @upload="onUpload"
  >
    <template #file>
      <div>
        <div
          class="rounded"
          v-if="resource"
          @click.stop
          style="cursor: default"
        >
          <ResourcePreview
            :type="resource.type"
            :src="objectURL"
          ></ResourcePreview>
        </div>
        <div
          @click.stop
          style="cursor: default"
          class="rounded"
          v-else-if="entity.originalName"
        >
          <ResourcePreview :type="entity.type" :src="src"></ResourcePreview>
        </div>

        <Icon v-else type="icon-file" style="font-size: 64px"> </Icon>

        <div class="mt-3">
          <div
            v-if="
              store.upload.status[entity.id] === 1 &&
              (store.upload.rates[entity.id] || resource?.size || entity?.size)
            "
          >
            <span v-if="resource?.size || entity?.size">
              总大小：{{ size(resource?.size || entity?.size || 0) }}
            </span>
            <a-divider type="vertical" />

            <span v-if="store.upload.rates[entity.id]">
              {{ size(store.upload.rates[entity.id]) }} /s
            </span>
          </div>

          <a-progress
            class="mt-3"
            v-if="
              store.upload.percents[entity.id] &&
              store.upload.status[entity.id] === 1
            "
            :percent="store.upload.percents[entity.id]"
          />
        </div>
      </div>
    </template>
  </UploadResource>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { Schema, SystemResource } from "../../../store/interface";
import UploadResource from "../UploadResource.vue";
import Icon from "../Icon.vue";
import ResourcePreview from "../ResourcePreview.vue";
import { ResourceApi } from "../../../api";
import { store } from "../../../store";
import { size } from "../../../utils";

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

const src = ref(
  props.entity.originalName ? ResourceApi.of({ id: props.entity.id }) : ""
);
const objectURL = ref("");

const resource = ref<File>();

watch(resource, () => {
  if (resource.value) {
    objectURL.value = createObjectURL(resource.value);
  }
});

function onUpload(file: File) {
  resource.value = file;
  store.upload.status[props.entity.id] = file === undefined ? 0 : 1;
  store.upload.percents[props.entity.id] = 0;
  store.upload.rates[props.entity.id] = 0;
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
