<template>
  <div>
    <div
      class="drawer-handle"
      @click="visible = !visible"
      :class="{ active: visible }"
    >
      <Icon type="icon-menu"></Icon>
    </div>
    <div>
      <a-drawer
        placement="left"
        v-model:visible="visible"
        :closable="false"
        :width="280"
      >
        <slot></slot>
      </a-drawer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";
const visible = ref(false);
</script>
<style scoped lang="less">
.drawer-handle {
  position: absolute;
  top: 120px;
  width: 41px;
  left: 0px;
  height: 40px;
  cursor: pointer;
  z-index: 9999;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 0 4px 4px 0;
  box-shadow: 2px 0 8px #00000026;
  transition: all 0.2s;
}
.drawer-handle.active {
  left: 280px;
  box-shadow: none;
}
</style>
