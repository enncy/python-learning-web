<template>
  <PassportLayout>
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="忘记密码">
        <div class="input-list">
          <a-input
            v-model:value="form.email"
            placeholder="输入邮箱"
            :bordered="false"
            size="large"
            allow-clear
          />
          <a-input
            v-model:value="form.verify_code"
            placeholder="输入邮箱验证码"
            size="large"
            allow-clear
            :bordered="false"
          />

          <a-button type="primary" class="w-100 mt-5" size="large">
            重置密码
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-button class="float-end" type="link" @click="router.push('/login')">
      返回登录
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
  email: "",
  verify_code: "",
});
</script>

<style scoped lang="less"></style>
