<template>
  <div>
    <a-modal
      :destroyOnClose="true"
      :style="top ? { top: top + 'px' } : {}"
      class="simplify-modal"
      :footer="null"
      :closable="false"
      :width="(props.width || 400) + 'px'"
      :visible="props.visible"
      @cancel="emits('update:visible', false)"
      @ok="emits('update:visible', false)"
    >
      <template v-if="props.title">
        <h2>
          {{ props.title }}
        </h2>
        <a-divider class="mt-1 mb-3"></a-divider>
      </template>

      <slot></slot>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  title?: string;
  width?: number;
  visible?: boolean;
  top?: number;
}>();

const emits = defineEmits<{
  (e: "update:visible", visible: boolean): void;
}>();
</script>
<style lang="less">
.simplify-modal {
  .ant-modal-content {
    border-radius: 8px !important;
  }
}
</style>
