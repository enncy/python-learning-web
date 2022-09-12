<template>
  <PassportLayout>
    <h1 class="text-start">
      邮箱找回密码
      <span class="fs-6 text-secondary"> - {{ config.name }}</span>
    </h1>
    <a-divider></a-divider>
    <form ref="forgetForm" class="input-list">
      <a-input
        v-model:value="form.email"
        placeholder="输入邮箱"
        :bordered="false"
        size="large"
        allow-clear
        required
        type="email"
      >
        <template #suffix>
          <button
            type="submit"
            class="ant-btn ant-btn-link ant-btn-sm"
            @click="sendVerifyCode($event, forgetForm, form)"
          >
            发送验证码
          </button>
        </template>
      </a-input>
      <a-input
        v-model:value="form.verify_code"
        placeholder="输入邮箱验证码"
        size="large"
        allow-clear
        :maxlength="6"
        :minlength="6"
        :bordered="false"
      />

      <button
        class="ant-btn ant-btn-primary ant-btn-lg w-100 mt-3 p-0 mb-5"
        size="large"
        type="submit"
      >
        验证邮箱
      </button>
    </form>

    <a-button class="float-end p-0" type="link" @click="router.push('/login')">
      返回登录
    </a-button>
  </PassportLayout>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "../../api";
import PassportLayout from "../../layout/common/PassportLayout.vue";
import { config } from "../../store";
import { sendVerifyCode } from "../../utils/passport/verify";

const router = useRouter();

const form = reactive({
  email: "",
  verify_code: "",
});

const forgetForm = ref() as Ref<HTMLFormElement>;

onMounted(() => {
  nextTick(() => {
    forgetForm.value.onsubmit = (e) => {
      e.preventDefault();
      console.log(forgetForm);

      if (forgetForm.value.checkValidity()) {
        UserApi.verifyCode(form).then(() => router.push("/reset"));
      }
      return false;
    };
  });
});
</script>

<style scoped lang="less"></style>
