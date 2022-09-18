<template>
  <div>
    <template v-for="(model, index) of comments" :key="index">
      <div class="message">
        <div class="row">
          <div class="col-1">
            <Avatar :size="42" :user="model.user"></Avatar>
          </div>
          <div class="col-11 row">
            <div class="col-12">
              <b>@{{ model.user.nickname || model.user.username }}</b>
              <span>
                在
                <b
                  class="post"
                  @click="router.push('/bbs/post/' + model.post.id)"
                >
                  <MaxSpan :value="model.post.title" :length="50"></MaxSpan>
                </b>
                -
                <b>{{ model.comment.level }}楼</b>
                <span class="text-secondary ms-3"> 提及到你</span>
              </span>
            </div>
            <div class="col-12 text-secondary">
              {{ model.comment.content }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-3 text-end">
      <Pagination v-model:pagination="pagination"></Pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { UserApi } from "../../api";
import { BBSCommentModel } from "../../store/interface";
import Avatar from "../../components/common/Avatar.vue";
import Pagination from "../../components/common/Pagination.vue";
import MaxSpan from "../../components/common/MaxSpan.vue";
import { router } from "../../router";

const pagination = reactive({
  page: 1,
  size: 10,
  total: 10,
});

const comments = ref<BBSCommentModel[]>();

watch(pagination, () => {
  renderData();
});

onMounted(() => {
  renderData();
});

function renderData() {
  UserApi.listMessage({ page: pagination.page, size: pagination.size }).then(
    ({ data: { data } }) => {
      comments.value = data.records;
      pagination.total = data.total;
    }
  );
}
</script>
<style scoped lang="less">
.message {
  padding: 12px;
  border-bottom: 1px dashed #e6e6e6;
}

.message + .message {
  margin-top: 12px;
}

.post {
  cursor: pointer;
  text-decoration: underline;
}
</style>
