import { router } from "./../router/index";
import { message } from "ant-design-vue";
import { createSimplifyLoginWindow } from ".";
import { ApiResponse } from "../api/interface";

export function requestErrorHandler(data: ApiResponse) {
  const status = data.status;

  switch (status) {
    case 500:
      {
        message.error("服务器内部错误");
      }
      break;
    case 401:
      {
        message.error("请登录后再进行操作");
        createSimplifyLoginWindow();
      }
      break;
    case 403:
      {
        message.error("权限不足，禁止访问！");
        router.replace("/403");
      }
      break;
    default: {
      message.error(data.msg);
    }
  }
}
