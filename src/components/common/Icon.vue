<template>
  <IconFont :type="type" :title="title" />
</template>

<script setup lang="ts">
import { createFromIconfontCN } from "@ant-design/icons-vue";
import { toRefs } from "vue";
import { config } from "../../store";
interface IconProps {
  type: string;
  title?: string;
  active?: boolean;
}
const props = withDefaults(defineProps<IconProps>(), {
  title: "",
});
const { type } = toRefs(props);

const IconFont = createFromIconfontCN({
  scriptUrl: config.common.icon_url, // ε¨ iconfont.cn δΈηζ,
});
</script>

<style scoped lang="less">
.active {
  color: #1890ff;
}
</style>
