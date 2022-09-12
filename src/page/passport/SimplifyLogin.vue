<template>
  <Login :simplify="true" @login="onLogin"></Login>
</template>
<script setup lang="ts">
import Login from "./login.vue";

function onLogin(user: any) {
  window.opener.onLogin(user);
}
</script>
<style scoped lang="less"></style>
