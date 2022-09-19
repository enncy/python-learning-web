import { UserModel } from "./../store/interface";
import { request } from "../request";
import { BBSCommentModel, BBSPostModel, Page, User } from "../store/interface";
import { ApiResponse } from "./interface";
import { parseEntity } from "./utils";

type T = ApiResponse;

export const UserApi = {
  update(user: Partial<User>) {
    return request.post<ApiResponse<boolean>>(
      "/user/update",
      parseEntity(user)
    );
  },
  model(wrapper: {
    username?: string;
    email?: string;
    slug?: string;
    page: number;
    size: number;
  }) {
    return request.get<ApiResponse<UserModel>>("/user/model", {
      params: wrapper,
    });
  },
  loginRecord(wrapper: { id: string }) {
    return request.get<ApiResponse<any[]>>("/user/login/record", {
      params: wrapper,
    });
  },
  listUser(wrapper: {
    page: number;
    size: number;
    username?: string;
    nickname?: string;
  }) {
    return request.get<ApiResponse<User[]>>("/list/user", { params: wrapper });
  },
  findUser(wrapper: { id?: number; email?: string }) {
    return request.get<ApiResponse<User>>("/find/user", { params: wrapper });
  },

  login(wrapper: {
    type?: string;
    username?: string;
    password?: string;
    email?: string;
    verify_code?: string;
  }) {
    return request.get<ApiResponse<User>>("/login", { params: wrapper });
  },
  logout() {
    return request.get<ApiResponse<void>>("/logout");
  },
  register(wrapper: {
    username: string;
    password: string;
    confirm: string;
    email: string;
    verify_code: string;
  }) {
    return request.post<ApiResponse<boolean>>("/register", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  sendVerifyCode(wrapper: { email: string }) {
    return request.get<ApiResponse<boolean>>("/send/verify/code", {
      params: wrapper,
    });
  },
  verifyCode(wrapper: { email: string; verify_code: string }) {
    return request.get<ApiResponse<boolean>>("/verify/code", {
      params: wrapper,
    });
  },
  resetPassword(wrapper: { password: string; confirm: string }) {
    return request.get<ApiResponse<boolean>>("/reset/password", {
      params: wrapper,
    });
  },
  listPostModel(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<Page<BBSPostModel>>>("/user/list/post", {
      params: wrapper,
    });
  },
  readMessage() {
    return request.get<ApiResponse<boolean>>("/user/read-message");
  },
  listMessage(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<Page<BBSCommentModel>>>(
      "/user/list/message",
      {
        params: wrapper,
      }
    );
  },
};
