<template>
  <a-menu :selectable="false">
    <template v-for="item of menus" :key="item.path">
      <a-menu-item>
        <component v-if="item.component" :is="item.component"></component>
        <div v-if="item.path" class="item" @click="router.push(item.path!)">
          <Icon v-if="item.icon" class="ms-2 me-2" :type="item.icon" />
          <span> {{ item.name }} </span>
        </div>
        <div
          v-if="item.redirect"
          class="item"
          @click="doc.location.href = item.redirect"
        >
          <Icon v-if="item.icon" class="ms-2 me-2" :type="item.icon" />
          <span> {{ item.name }} </span>
        </div>
      </a-menu-item>
      <component
        v-if="item.divider"
        :is="adaption ? Divider : MenuDivider"
      ></component>
    </template>
  </a-menu>
</template>
<script setup lang="ts">
import { Divider, MenuDivider } from "ant-design-vue";
import { useRouter } from "vue-router";
import Icon from "./Icon.vue";

const doc = document;

const router = useRouter();
defineProps<{
  menus: any;
  adaption: boolean;
}>();
</script>
<style scoped lang="less">
.item {
  width: 180px;
  padding: 4px 0px;
  display: inline-block;
}
</style>
