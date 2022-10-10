<template>
  <div v-if="user">
    <Card class="d-flex">
      <div class="text-center d-inline-block">
        <Avatar
          class="rounded"
          shape="square"
          :size="160"
          :user="user"
        ></Avatar>
      </div>
      <div class="text-center" style="width: 100%">
        <div class="ms-5 me-5 h-100">
          <UploadResource
            name="file"
            :multiple="false"
            accept="image/*"
            @upload="handleUpload"
          >
          </UploadResource>
        </div>
      </div>
    </Card>

    <Card>
      <div class="info-item">
        <span> UID : </span>
        <a-input disabled :value="user.id" />
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
          :addon-before="`${dom.location.origin}/@`"
        />
      </div>
      <a-divider></a-divider>
      <div class="info-item">
        <span>用户名 :</span>
        <a-input v-model:value="user.username"> </a-input>
      </div>
      <div class="info-item">
        <span>密码 :</span>
        <a-input v-model:value="user.password"> </a-input>
      </div>
      <div class="info-item">
        <span>邮箱 :</span>
        <a-input v-model:value="user.email"> </a-input>
      </div>
      <a-divider></a-divider>
      <div class="info-item">
        <span> 权限 : </span>
        <a-input disabled :value="getRole(user.role).desc" />
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

      <a-button type="primary" class="w-100 mt-3" @click="update">
        更新
      </a-button>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { store } from "../../store";
import Card from "../../components/common/Card.vue";
import { message } from "ant-design-vue";
import { ResourceApi, UploadApi, UserApi } from "../../api";
import UploadResource from "../../components/common/UploadResource.vue";
import Avatar from "../../components/common/Avatar.vue";
import { getRole } from "../../utils";
import { ref, watch } from "vue";

const dom = document;

const user = ref(store.user);

async function handleUpload(file: File) {
  if (user.value) {
    await ResourceApi.init({
      resource: file,
      folder: "avatar",
      id: user.value.id,
      invalid: false,
      filename: user.value.id,
    });
    ResourceApi.upload(user.value.id, file).then((finished) => {
      if (finished) {
        message.success("上传成功");
        window.location.reload();
      } else {
        message.error("上传失败");
      }
    });
  }
}

function update() {
  if (user.value) {
    const { username, nickname, password, email, profile, slug, id } =
      user.value;
    UserApi.update({
      username,
      nickname,
      password,
      email,
      profile,
      slug,
      id,
    }).then(({ data: { data, msg } }) => {
      if (data) {
        store.user = user.value;
        message.success(msg);
        window.location.reload();
      } else {
        message.error(msg);
      }
    });
  }
}
</script>
<style scoped lang="less">
.info-item + .info-item {
  margin-top: 12px;
}

.upload-img {
  border: 1px dashed gray;
  border-radius: 4px;
}
</style>
