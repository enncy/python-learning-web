<template>
  <PassportLayout>
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="账号密码注册">
        <div class="input-list">
          <a-input
            v-model:value="form.username"
            placeholder="输入账号"
            :bordered="false"
            size="large"
            allow-clear
          />
          <a-input
            v-model:value="form.password"
            placeholder="输入密码"
            :bordered="false"
            size="large"
            allow-clear
          />
          <a-input
            v-model:value="form.email"
            placeholder="输入邮箱"
            size="large"
            allow-clear
            :bordered="false"
          />
          <a-input
            v-model:value="form.verify_code"
            placeholder="输入验证码"
            size="large"
            allow-clear
            :bordered="false"
          />
          <a-button type="primary" class="w-100 mt-5" size="large">
            注册
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-button class="float-end" type="link" @click="router.push('/login')">
      已有账号？点击登录
    </a-button>
  </PassportLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import PassportLayout from "../../layout/common/PassportLayout.vue";
const router = useRouter();
const activeKey = ref("1");
const form = reactive({
  username: "",
  password: "",
  confirm: "",
  email: "",
  verify_code: "",
});
</script>

<style scoped lang="less"></style>
