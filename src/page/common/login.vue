<template>
  <PassportLayout class="text-center">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="账号密码登录">
        <div class="input-list">
          <a-input
            v-model:value="form.username"
            placeholder="输入账号"
            :bordered="false"
            size="large"
            allow-clear
          >
          </a-input>
          <a-input
            v-model:value="form.password"
            placeholder="输入密码"
            :bordered="false"
            size="large"
            allow-clear
          >
          </a-input>
          <a-button type="primary" class="w-100 mt-5" size="large">
            登录
          </a-button>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="邮箱登录" force-render>
        <div class="input-list">
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
            登录
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-button
      class="float-start"
      type="link"
      @click="router.push('/forget-password')"
    >
      忘记密码
    </a-button>

    <a-button class="float-end" type="link" @click="router.push('/register')">
      没有账号？点击注册
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
  email: "",
  verify_code: "",
});
</script>

<style scoped lang="less"></style>
