<template>
  <div>
    <div class="detail">
      文件名 :
      <div class="float-end">{{ code.filename }}</div>
    </div>
    <div class="detail">
      字数 :
      <div class="float-end">{{ code.content.length }}</div>
    </div>
    <div class="detail">
      行数 :
      <div class="float-end">{{ code.content.split("\n").length }}</div>
    </div>
    <div class="detail">
      创建时间 :
      <div class="float-end">
        {{ dayjs(code.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </div>
    </div>
    <div class="detail">
      最近更新 :
      <div class="float-end">
        {{ dayjs(code.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { Code } from "../../../store/interface";

defineProps<{
  code: Code;
}>();
</script>
<style scoped lang="less">
.detail + .detail {
  margin-top: 12px;
}
</style>
