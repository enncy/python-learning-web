<template>
  <CommonLayout>
    <div class="page">
      <!-- 标签页 -->
      <div>
        <template v-for="code in codes" :key="code.filename">
          <a-tag
            class="code-tag"
            :color="
              codes[currentCodeIndex].filename === code.filename
                ? 'processing'
                : 'default'
            "
            @click="open(code.filename)"
          >
            <span class="ms-1 me-2">{{
              code.filename.length > 20
                ? `${code.filename.slice(0, 20)}...`
                : code.filename
            }}</span>

            <a-popconfirm
              v-if="codes.length > 1"
              title="确定删除此文件吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleClose(code.filename)"
            >
              <Icon class="ms-3 tag-closer" type="icon-close" @click.stop="" />
            </a-popconfirm>
          </a-tag>
        </template>

        <a-tag
          class="code-tag ps-3 pe-3"
          style="background: #fff; border-style: dashed"
          @click="newFileModelVisible = true"
        >
          <Icon type="icon-plus" />
        </a-tag>
      </div>

      <div class="compiler">
        <!-- 编辑器 -->
        <MonacoEditor
          :model-value="content"
          @update:model-value="
            (c) => {
              codes[currentCodeIndex].content = c;
            }
          "
        >
          <template #actions>
            <a-button
              ghost
              type="primary"
              class="me-3"
              @click="showCompiles"
              shape="round"
              size="small"
            >
              <Icon type="icon-unorderedlist" /> 编译列表
            </a-button>
            <a-button
              ghost
              type="primary"
              class="me-3"
              @click="save"
              shape="round"
              size="small"
            >
              <Icon type="icon-save" /> 保存
            </a-button>
            <a-button
              ghost
              type="primary"
              class="me-3"
              @click="lint"
              shape="round"
              size="small"
            >
              <Icon type="icon-CodeSandbox" /> 编译
            </a-button>
            <a-button
              type="primary"
              @click="compile"
              shape="round"
              size="small"
            >
              <Icon type="icon-caret-right" /> 运行
            </a-button>
          </template>
        </MonacoEditor>
      </div>

      <div>
        <span class="text-secondary">输入 :</span>
        <a-textarea
          class="compile-input"
          v-model:value="input"
          placeholder=""
        />
      </div>

      <div>
        <span class="text-secondary">输出 :</span>
        <pre class="code compile-output">{{
          currentCompile?.errorMessage || currentCompile?.output || ""
        }}</pre>
      </div>
    </div>

    <SimplifyModel
      :width="800"
      :top="20"
      :title="`${codes[currentCodeIndex].filename}-编译列表`"
      v-model:visible="compilesModelVisible"
    >
      <CompilesList :compiles="compiles"></CompilesList>
    </SimplifyModel>

    <SimplifyModel title="新增文件" v-model:visible="newFileModelVisible">
      <NewFile @create="createNewFile"></NewFile>
    </SimplifyModel>
  </CommonLayout>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import CommonLayout from "../../layout/CommonLayout.vue";
import { CompilerApi } from "../../api/compile";
import { message } from "ant-design-vue";
import { store, config } from "../../store";
import Icon from "../../components/common/Icon.vue";
import MonacoEditor from "../../components/common/compiler/MonacoEditor.vue";
import SimplifyModel from "../../components/common/SimplifyModel.vue";
import CompilesList from "../../components/common/compiler/CompilesList.vue";
import NewFile from "../../components/common/compiler/NewFile.vue";

// 代码列表
const codes = ref(
  store.compiler.codes.length
    ? store.compiler.codes
    : [config.compiler.defaultCode]
);

// 编译列表
const compiles = ref(
  store.compiler.compiles.length
    ? store.compiler.compiles
    : [config.compiler.defaultCompile]
);

// 当前代码索引
const currentCodeIndex = computed(() => {
  const index = codes.value.findIndex(
    (code) => code.filename === store.compiler.currentTag
  );
  return index === -1 ? 0 : index;
});
// 编辑器编译结果
const currentCompile = computed(() => compiles.value[0]);

// 编辑器内容
const content = ref(codes.value[currentCodeIndex.value].content);

// 输入内容
const input = ref("");

const compilesModelVisible = ref(false);
const newFileModelVisible = ref(false);

// 删除文件
function handleClose(removedTag: string) {
  const code = codes.value.find((code) => code.filename === removedTag);
  if (code) {
    CompilerApi.remove({ id: code.id });
    codes.value = codes.value.filter((code) => code.filename !== removedTag);
  }
}

// 创建新文件
function createNewFile(filename: string, content: string) {
  if (
    filename &&
    codes.value.map((code) => code.filename).indexOf(filename) === -1
  ) {
    const newCode = {
      id: Date.now().toString(),
      filename: filename,
      content: content,
    };

    codes.value.push(newCode);
    // 创建新文件
    CompilerApi.save(newCode);
    newFileModelVisible.value = false;
  } else {
    message.warn("存在同名文件！");
  }
}

// 编译代码
function compile() {
  const coed = codes.value[currentCodeIndex.value];
  CompilerApi.compile({
    input: input.value,
    ...coed,
  }).then(({ data: { data, msg } }) => {
    compiles.value.unshift(data);
    if (data.errorMessage) {
      message.error("运行失败，存在语法错误");
    } else {
      message.success(msg);
    }
  });
}

function lint() {
  const coed = codes.value[currentCodeIndex.value];
  CompilerApi.lint({
    input: input.value,
    ...coed,
  }).then(({ data: { data, msg } }) => {
    if (data.errorMessage) {
      compiles.value[0].errorMessage = data.errorMessage;
      message.error("编译失败，存在语法错误");
    } else {
      compiles.value[0].errorMessage = "";
      message.success(msg);
    }
  });
}

// 打开代码标签
function open(tag: string) {
  // 更新代码对象
  store.compiler.currentTag = tag;

  // 更新编辑器内容
  content.value = codes.value[currentCodeIndex.value].content;
  // 重新获取编译列表
  CompilerApi.listCompiles({
    code_id: codes.value[currentCodeIndex.value].id.toString(),
  }).then(({ data: { data } }) => {
    compiles.value = data;
  });
}

function save() {
  const coed = codes.value[currentCodeIndex.value];
  CompilerApi.save({
    content: coed.content,
    filename: coed.filename,
  }).then(({ data: { msg } }) => {
    message.success(msg);
  });
}

function showCompiles() {
  compilesModelVisible.value = true;
}

// 从服务器获取代码以及编译信息
onMounted(() => {
  nextTick(() => {
    if (store.user) {
      CompilerApi.listCodes().then(({ data: { data } }) => {
        codes.value = data.length ? data : [config.compiler.defaultCode];

        CompilerApi.listCompiles({
          code_id: codes.value[currentCodeIndex.value].id.toString(),
        }).then(({ data: { data } }) => {
          compiles.value = data.length
            ? data
            : [config.compiler.defaultCompile];
        });
      });
    }
  });
});

// 同步数据
watch(codes, (curr) => (store.compiler.codes = curr));
watch(compiles, (curr) => (store.compiler.compiles = curr));
</script>
<style scoped lang="less">
:deep(.ant-tag) {
  font-size: 14px;
  padding: 4px;
}

.code-tag {
  cursor: pointer;
}

.compile-input,
.compile-output {
  min-height: 10vh;
  max-height: 20vh;
  border-radius: 4px;
}

.tag-closer {
  &:hover {
    background-color: #ffffff;
    border-radius: 100%;
    border: 1px solid #e4e4e4;
  }
}
</style>
