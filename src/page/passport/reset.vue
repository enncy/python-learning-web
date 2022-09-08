<template>
  <PassportLayout>
    <h1 class="text-start">
      重置密码
      <span class="fs-6 text-secondary"> - {{ store.config.name }}</span>
    </h1>
    <a-divider></a-divider>
    <form ref="resetForm" class="input-list">
      <a-input
        v-model:value="form.password"
        placeholder="输入密码"
        :bordered="false"
        size="large"
        allow-clear
        :maxlength="20"
        :minlength="6"
        require
      />
      <a-input
        v-model:value="form.confirm"
        placeholder="重复密码"
        size="large"
        allow-clear
        :bordered="false"
        :maxlength="20"
        :minlength="6"
        require
      />

      <button
        type="submit"
        class="ant-btn ant-btn-primary ant-btn-lg w-100 mt-3 mb-5 p-0"
        size="large"
      >
        重置密码
      </button>
    </form>

    <a-button class="float-end p-0" type="link" @click="router.push('/login')">
      返回登录
    </a-button>
  </PassportLayout>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { nextTick, onMounted, reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { UserApi } from "../../api";
import PassportLayout from "../../layout/common/PassportLayout.vue";
import { store } from "../../store";
const router = useRouter();
const form = reactive({
  password: "",
  confirm: "",
});

const resetForm = ref() as Ref<HTMLFormElement>;

onMounted(() => {
  nextTick(() => {
    resetForm.value.onsubmit = (e) => {
      e.preventDefault();
      if (resetForm.value.checkValidity()) {
        UserApi.resetPassword(form).then(({ data: { data, msg } }) => {
          message.success(msg);
          store.data.user = data;
          setTimeout(() => router.push("/"), 1000);
        });
      }
      return false;
    };
  });
});
</script>

<style scoped lang="less"></style>
