<template>
  <a-menu :selectable="false">
    <template v-for="item of menus" :key="item.path">
      <a-menu-item>
        <component v-if="item.component" :is="item.component"></component>
        <div v-if="item.path || item.href" class="item" @click="link(item)">
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

function link(item: any) {
  console.log(item);

  if (item.href) {
    window.open(item.href, "_blank");
  } else if (item.path) {
    router.push(item.path);
  }
}
</script>
<style scoped lang="less">
.item {
  width: 180px;
  padding: 4px 0px;
  display: inline-block;
}
</style>
