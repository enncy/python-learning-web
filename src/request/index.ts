import { message } from "ant-design-vue";
import axios from "axios";
import { requestErrorHandler } from "../utils/request.error.handler";

export const request = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
  timeout: 60 * 1000,
  timeoutErrorMessage: "服务器响应超时",
  // 携带 cookie
  withCredentials: true,
});

request.defaults.withCredentials = true;

// 添加请求拦截器
request.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    const {
      data: { status, msg },
    } = response;

    if (status === 200) {
      return Promise.resolve(response);
    } else {
      requestErrorHandler(response.data);
      return Promise.reject(msg);
    }
  },
  (error) =>
    message.error(
      String(error.message) === "Network Error"
        ? "网络或者服务器内部错误"
        : error.message
    )
);
