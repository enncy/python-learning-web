<template>
  <PassportLayout>
    <h1 class="text-start">
      注册 <span class="fs-6 text-secondary"> - {{ config.name }}</span>
    </h1>
    <form class="input-list" ref="registerForm">
      <a-input
        v-model:value="form.username"
        placeholder="输入账号"
        :bordered="false"
        size="large"
        type="text"
        required
        :maxlength="20"
        :minlength="2"
        allow-clear
      />
      <a-input
        v-model:value="form.password"
        placeholder="输入密码"
        :bordered="false"
        size="large"
        type="password"
        required
        :maxlength="20"
        :minlength="6"
        allow-clear
      />
      <a-input
        v-model:value="form.confirm"
        placeholder="重复密码"
        :bordered="false"
        size="large"
        type="password"
        required
        :maxlength="20"
        :minlength="6"
        allow-clear
      />
      <a-input
        v-model:value="form.email"
        placeholder="输入邮箱"
        size="large"
        type="email"
        allow-clear
        required
        :bordered="false"
      >
        <template #suffix>
          <button
            type="submit"
            class="ant-btn ant-btn-link ant-btn-sm"
            @click="sendVerifyCode($event, registerForm, form)"
          >
            发送验证码
          </button>
        </template>
      </a-input>
      <a-input
        v-model:value="form.verify_code"
        placeholder="输入验证码"
        size="large"
        allow-clear
        :bordered="false"
      />
      <div
        class="gx-3 d-grid mt-3 mb-5"
        style="grid-template-columns: 1fr 4fr; gap: 4px"
      >
        <button
          type="reset"
          class="ant-btn ant-btn-lg"
          @click="resetObject(form)"
        >
          重置
        </button>
        <button type="submit" class="ant-btn ant-btn-primary ant-btn-lg">
          注册
        </button>
      </div>
    </form>
    <a-button class="float-end p-0" type="link" @click="router.push('/login')">
      已有账号？点击登录
    </a-button>
  </PassportLayout>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { nextTick, onMounted, reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "../../api";
import PassportLayout from "../../layout/common/PassportLayout.vue";
import { store, config } from "../../store";
import { sendVerifyCode, resetObject } from "../../utils/passport/verify";
const router = useRouter();

const form = reactive({
  username: "",
  password: "",
  confirm: "",
  email: "",
  verify_code: "",
});

const registerForm = ref() as Ref<HTMLFormElement>;

onMounted(() => {
  nextTick(() => {
    registerForm.value.onsubmit = (e) => {
      e.preventDefault();
      if (registerForm.value.checkValidity()) {
        UserApi.register(form).then(({ data: { data, msg } }) => {
          message.success(msg);
          setTimeout(() => router.push("/"), 1000);
        });
      }

      return false;
    };
  });
});
</script>

<style scoped lang="less"></style>
