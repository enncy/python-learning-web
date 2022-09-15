import { request } from "../request";
import { ApiResponse } from "./interface";

type T = ApiResponse;

export const UserApi = {
  info(wrapper: { username?: string; email?: string; slug?: string }) {
    return request.get<T>("/user/info", { params: wrapper });
  },
  loginRecord(wrapper: { id: string }) {
    return request.get<T>("/user/login/record", { params: wrapper });
  },
  listUser(wrapper: {
    page: number;
    size: number;
    username?: string;
    nickname?: string;
  }) {
    return request.get<T>("/list/user", { params: wrapper });
  },
  findUser(wrapper: { id?: number; email?: string }) {
    return request.get<T>("/find/user", { params: wrapper });
  },

  login(wrapper: {
    type?: string;
    username?: string;
    password?: string;
    email?: string;
    verify_code?: string;
  }) {
    return request.get<T>("/login", { params: wrapper });
  },
  logout() {
    return request.get<T>("/logout");
  },
  register(wrapper: {
    username: string;
    password: string;
    confirm: string;
    email: string;
    verify_code: string;
  }) {
    return request.post<T>("/register", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  sendVerifyCode(wrapper: { email: string }) {
    return request.get<T>("/send/verify/code", { params: wrapper });
  },
  verifyCode(wrapper: { email: string; verify_code: string }) {
    return request.get<T>("/verify/code", { params: wrapper });
  },
  resetPassword(wrapper: { password: string; confirm: string }) {
    return request.get<T>("/reset/password", { params: wrapper });
  },
};
