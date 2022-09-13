<template>
  <div v-if="user">
    <div class="row m-0 shadow-sm rounded mb-3">
      <div class="col-12 col-lg-4 border text-center p-3">
        <a-avatar :size="200" shape="square"></a-avatar>
      </div>
      <div class="col-12 col-lg-8 border text-center p-3">上传头像</div>
    </div>

    <div class="p-3 shadow rounded">
      <div class="info-item">
        <span> UID : </span>
        <a-input disabled :value="user.id" />
      </div>
      <div class="info-item">
        <span>用户名 :</span>
        <a-input v-model:value="user.username"> </a-input>
      </div>
      <div class="info-item">
        <span>昵称 :</span>
        <a-input v-model:value="user.nickname"> </a-input>
      </div>
      <div class="info-item">
        <span>简介 :</span>
        <a-textarea
          v-model:value="user.profile"
          :row="3"
          placeholder="输入你的简介..."
          :maxlength="100"
          style="max-height: 64px"
        >
        </a-textarea>
      </div>
      <div class="info-item">
        <span>主页地址 :</span>
        <a-input
          v-model:value="user.slug"
          :addon-before="`${dom.location.origin}/user/`"
        />
      </div>

      <div class="info-item">
        <span>密码 :</span>
        <a-input v-model:value="user.password"> </a-input>
      </div>
      <div class="info-item">
        <span>邮箱 :</span>
        <a-input v-model:value="user.email"> </a-input>
      </div>
      <div class="info-item">
        <span> 权限 : </span>
        <a-input
          disabled
          :value="
            user.role === 'admin'
              ? '管理员'
              : user.role === 'user'
              ? '用户'
              : '游客'
          "
        />
      </div>

      <div class="info-item">
        <span> 注册时间 : </span>
        <a-input
          disabled
          :value="new Date(user.createTime).toLocaleString('zh-CN')"
        />
      </div>
      <div class="info-item">
        <span> 最近更新 : </span>
        <a-input
          disabled
          :value="new Date(user.updateTime).toLocaleString('zh-CN')"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { store } from "../../store";

const dom = document;

const user = store.user;
</script>
<style scoped lang="less">
.info-item + .info-item {
  margin-top: 12px;
}
</style>
