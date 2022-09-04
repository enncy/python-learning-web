<template>
  <PassportLayout>
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="重置密码">
        <div class="input-list">
          <a-input
            v-model:value="form.password"
            placeholder="输入密码"
            :bordered="false"
            size="large"
            allow-clear
          />
          <a-input
            v-model:value="form.confirm"
            placeholder="再次确认密码"
            size="large"
            allow-clear
            :bordered="false"
          />

          <a-button type="primary" class="w-100 mt-5" size="large">
            重置
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </PassportLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import PassportLayout from "../../layout/common/PassportLayout.vue";

const activeKey = ref("1");
const form = reactive({
  password: "",
  confirm: "",
});
</script>

<style scoped lang="less"></style>
