<template>
  <tr v-if="model" class="meta-row">
    <td class="text-nowrap fw-bold sm text-center">
      {{ model.user.nickname || model.user.nickname }}
    </td>
    <td>
      <div class="text-secondary sm ms-3">
        发表于
        {{ dayjs(model.post.createTime).format("YYYY-MM-DD hh:mm") }}
        <a-divider type="vertical" />
        最后修改
        {{ dayjs(model.post.updateTime).format("YYYY-MM-DD hh:mm") }}
        <span class="float-end">{{ commentModel?.comment.level || 1 }}楼</span>
      </div>
    </td>
  </tr>
  <tr v-if="model" class="content-row">
    <td class="text-center pt-2 pb-3">
      <Avatar
        class="rounded"
        shape="square"
        :size="124"
        :user="model.user"
      ></Avatar>
      <div class="mt-2">
        身份 : {{ getRole(model.user.role || "visitor").desc }}
      </div>
      <div>
        注册 :
        {{ dayjs(commentModel?.user.createTime).format("YYYY-MM-DD") }}
      </div>
    </td>
    <td>
      <template v-if="commentModel?.parent">
        <div class="m-3 border rounded p-2 parent-comment">
          回复 {{ commentModel.parent.comment.level }}楼 @{{
            commentModel.parent.user.nickname ||
            commentModel.parent.user.username
          }}
          :
          <MaxSpan
            :value="commentModel.parent.comment.content"
            :length="50"
          ></MaxSpan>
        </div>
      </template>

      <template v-if="badge">
        <a-badge-ribbon :text="badge.text" :color="badge.color">
          <div class="p-3 me-3">
            <MarkdownText
              :content="
                commentModel?.comment.content || postModel?.post.content || ''
              "
            ></MarkdownText>
          </div>
        </a-badge-ribbon>
      </template>
      <template v-else>
        <div class="p-3">
          <MarkdownText
            :content="
              commentModel?.comment.content || postModel?.post.content || ''
            "
          ></MarkdownText>
        </div>
      </template>
      <div v-if="postModel" class="sm p-5">
        <a-divider class="text-secondary sm">版权声明</a-divider>
        <div class="text-secondary sm text-center">
          <div>1. 本帖所有内容纯属用户个人意见，与本论坛无关</div>
          <div>2. 未经原作者允许不得转载本文内容，否则将视为侵权</div>
          <div>3. 根据规定我们可以在不通知作者的情况下删除本帖</div>
          <div>4. 如果本帖有任何侵权内容，请联系我们进行删除</div>
        </div>
        <div class="d-flex mt-3 align-items-center justify-content-center">
          <a-space size="large">
            <div class="text-center post-actions">
              <Icon
                type="icon-star-fill"
                class="fs-1 post-action-icon"
                style="color: #fbb900"
              />
              <div>收藏</div>
            </div>
            <div @click="copyLink" class="text-center post-actions">
              <Icon
                type="icon-link"
                class="fs-1 post-action-icon"
                style="color: #6da1ff"
              />
              <div>复制链接</div>
            </div>
            <div @click="emits('comment')" class="text-center post-actions">
              <Icon
                type="icon-message"
                class="fs-1 post-action-icon"
                style="color: #8c8e93"
              />
              <div>评论</div>
            </div>
          </a-space>
        </div>
      </div>
    </td>
  </tr>
  <tr class="footer-row">
    <td></td>
    <td>
      <div v-if="commentModel" class="float-end">
        <a-space size="large">
          <span class="footer-action" @click="onReply(commentModel!)">
            <Icon type="icon-message" />
            评论
          </span>

          <template v-if="commentModel.user.id === store.user?.id">
            <span
              class="footer-action"
              @click="removeComment(commentModel?.comment.id!)"
            >
              <Icon type="icon-delete" /> 删除
            </span>
          </template>
        </a-space>

        <SimplifyModel
          :title="`回复 @${
            commentModel.user.nickname || commentModel.user.username
          }`"
          :width="1000"
          v-model:visible="replyModelVisible"
        >
          <MarkdownText
            :content="replyingComment?.content || ''"
          ></MarkdownText>
          <a-divider></a-divider>
          <MarkdownEditor v-model:content="reply.content"></MarkdownEditor>
          <div class="mt-3 d-flex justify-content-end">
            <a-button type="primary" ghost @click="onPublishReply"
              >回复</a-button
            >
          </div>
        </SimplifyModel>
      </div>
    </td>
  </tr>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { reactive, ref } from "vue";
import {
  BBSComment,
  BBSCommentModel,
  BBSPost,
  BBSPostModel,
  User,
} from "../../store/interface";
import { getRole } from "../../utils";
import Avatar from "../common/Avatar.vue";
import Icon from "../common/Icon.vue";
import MarkdownText from "../common/MarkdownText.vue";
import SimplifyModel from "../common/SimplifyModel.vue";
import MarkdownEditor from "../common/MarkdownEditor.vue";
import { BBSApi } from "../../api";
import MaxSpan from "../common/MaxSpan.vue";
import { store } from "../../store";

const props = defineProps<{
  badge?: {
    text: string;
    color: string;
  };
  postId: string;
  postModel?: BBSPostModel;
  commentModel?: BBSCommentModel;
}>();

const emits = defineEmits<{
  (e: "comment"): void;
}>();

const replyModelVisible = ref(false);
const replyingComment = ref<BBSComment>();

const reply = reactive({
  content: "",
  postId: props.postId,
  parentId: "",
  parentUserId: "",
});

const model = props.postModel || props.commentModel;

function copyLink() {
  navigator.clipboard.writeText(document.location.href);
  message.success("复制成功！");
}

function onReply(model: BBSCommentModel) {
  replyingComment.value = model.comment;
  reply.parentId = model.comment.id;
  reply.parentUserId = model.user.id;
  replyModelVisible.value = true;
}

function onPublishReply() {
  BBSApi.publishComment(reply).then(({ data: { data, msg } }) => {
    data ? message.success(msg) : message.error;
  });
}

function removeComment(id: string) {
  BBSApi.removeComment({ id }).then(({ data: { data, msg } }) => {
    data ? message.success(msg) : message.error(msg);
  });
}
</script>
<style scoped lang="less">
tr td {
  vertical-align: top !important;
}

.meta-row td {
  border-bottom: 1px dashed #e9e9e9;
}
.footer-row td:first-child,
.meta-row td:first-child,
.content-row td:first-child {
  background-color: #f0f0f0;
}

.content-row td:first-child {
  width: 150px;
}

.footer-row td {
  border-bottom: 2px solid #dfdfdf;
}

.post-actions {
  cursor: pointer;
}
.post-action-icon {
  padding: 12px;
}
.post-action-icon:hover {
  border-radius: 100%;
  background-color: #f1f1f1a6;
}

.footer-action {
  cursor: pointer;
}

.parent-comment {
  background-color: #f3f3f3;
}
</style>
