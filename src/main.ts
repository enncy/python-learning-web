import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App.vue";
import { router } from "./router";
import "ant-design-vue/dist/antd.css";
import "./assets/css/common.css";
import "./assets/css/bootstrap-utilities.css";
import "./assets/css/bootstrap-grid.css";
import { createFromIconfontCN } from "@ant-design/icons-vue";

const app = createApp(App);

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_3013134_pc3mmckqy1.js", // 在 iconfont.cn 上生成,
});

app.use(router).use(Antd).component("IconFont", IconFont).mount("#app");
