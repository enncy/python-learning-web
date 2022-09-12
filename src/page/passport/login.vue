<template>
  <PassportLayout class="text-center">
    <h1 class="text-start">
      登录 <span class="fs-6 text-secondary"> - {{ config.name }}</span>
    </h1>
    <a-divider></a-divider>

    <a-tabs v-model:activeKey="form.type" size="large">
      <a-tab-pane key="password" tab="账号密码登录">
        <form ref="passwordLoginForm" class="input-list">
          <a-input
            v-model:value="form.username"
            placeholder="输入账号"
            :bordered="false"
            size="large"
            allow-clear
            :maxlength="20"
            :minlength="2"
            required
          />

          <a-input
            v-model:value="form.password"
            placeholder="输入密码"
            :bordered="false"
            size="large"
            allow-clear
            :maxlength="20"
            :minlength="6"
            type="password"
            required
          />

          <button
            type="submit"
            class="ant-btn ant-btn-primary ant-btn-lg w-100 mt-3 mb-5"
            size="large"
          >
            登录
          </button>
        </form>
      </a-tab-pane>
      <a-tab-pane key="email" tab="邮箱登录" force-render>
        <form ref="emailLoginForm" class="input-list">
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
                @click="
                  sendVerifyCode(
                    $event,
                    form.type === 'password'
                      ? passwordLoginForm
                      : emailLoginForm,
                    form
                  )
                "
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
            :maxlength="6"
            :minlength="6"
            :bordered="false"
          />
          <button
            type="submit"
            class="ant-btn ant-btn-primary ant-btn-lg w-100 mt-3 mb-5"
            size="large"
          >
            登录
          </button>
        </form>
      </a-tab-pane>
    </a-tabs>

    <div style="height: 24px">
      <a-button
        class="float-start p-0"
        type="link"
        @click="router.push('/forget-password')"
      >
        忘记密码
      </a-button>

      <a-button
        class="float-end p-0"
        type="link"
        @click="router.push('/register')"
      >
        没有账号？点击注册
      </a-button>
    </div>

    <div style="clear: both" class="mt-4">
      <a-divider class="text-secondary">其他方式登录</a-divider>

      <Icon type="icon-QQ" style="color: #1890ff" class="other-login-icon" />
      <Icon
        type="icon-wechat-fill"
        style="color: #07c160"
        class="other-login-icon"
      />
      <Icon type="icon-github-fill" class="other-login-icon" />
    </div>
  </PassportLayout>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import PassportLayout from "../../layout/common/PassportLayout.vue";
import { store, config } from "../../store";
import { UserApi } from "../../api";
import { message } from "ant-design-vue";
import { sendVerifyCode } from "../../utils/passport/verify";
import Icon from "../../components/common/Icon.vue";

const router = useRouter();

const form = reactive({
  type: "password",
  username: "",
  password: "",
  email: "",
  verify_code: "",
});

const passwordLoginForm = ref() as Ref<HTMLFormElement>;
const emailLoginForm = ref() as Ref<HTMLFormElement>;

const emits = defineEmits<{
  (e: "login", value: any): void;
}>();

onMounted(() => {
  nextTick(() => {
    passwordLoginForm.value.onsubmit = handleLogin;
    emailLoginForm.value.onsubmit = handleLogin;
  });
});

function handleLogin(e: any) {
  e.preventDefault();
  const formElement =
    form.type === "password" ? passwordLoginForm : emailLoginForm;

  if (formElement.value.checkValidity()) {
    UserApi.login(form).then(({ data: { data, msg } }) => {
      message.success(msg);
      store.user = data;
      emits("login", data);
      setTimeout(() => router.push("/"), 1000);
    });
  }
  return false;
}
</script>

<style scoped lang="less">
.other-login-icon {
  padding: 8px;
  background-color: #f3f3f3;
  margin: 0px 12px;
  border-radius: 100%;
  font-size: 24px;
}
</style>
