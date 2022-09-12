import { message } from "ant-design-vue";
import { createSimplifyLoginWindow } from ".";
import { ApiResponse } from "../api/interface";
import { store } from "../store";

export function requestErrorHandler(data: ApiResponse) {
  const status = data.status;

  switch (status) {
    case 500:
      {
        message.error("服务器内部错误");
      }
      break;
    case 403:
      {
        message.error("请登录后再进行操作");
        createSimplifyLoginWindow();
      }
      break;
    default: {
      message.error(data.msg);
    }
  }
}
