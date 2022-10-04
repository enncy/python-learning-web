import {
  UserFavoriteModel,
  UserFollowModel,
  UserInfo,
  UserModel,
  UserSubscribeModel,
} from "./../store/interface";
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
    postPage: number;
    postSize: number;
    followPage: number;
    followSize: number;
    followingPage: number;
    followingSize: number;
    favoritePage: number;
    favoriteSize: number;
    subscribePage: number;
    subscribeSize: number;
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
  favorite(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/user/favorite", {
      params: wrapper,
    });
  },
  cancelFavorite(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/user/cancel-favorite", {
      params: wrapper,
    });
  },
  subscribe(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/user/subscribe", {
      params: wrapper,
    });
  },
  cancelSubscribe(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/user/cancel-subscribe", {
      params: wrapper,
    });
  },
  follow(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/user/follow", {
      params: wrapper,
    });
  },
  cancelFollow(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/user/cancel-follow", {
      params: wrapper,
    });
  },
  userInfo(wrapper: { id: string }) {
    return request.get<ApiResponse<UserInfo>>("/user-info", {
      params: wrapper,
    });
  },
  /** 获取粉丝列表 */
  listFollow(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<Page<UserFollowModel>>>(
      "/user/list-follow",
      {
        params: wrapper,
      }
    );
  },
  /** 获取关注列表 */
  listFollowing(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<Page<UserFollowModel>>>(
      "/user/list-following",
      {
        params: wrapper,
      }
    );
  },
  listFavorite(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<Page<UserFavoriteModel>>>(
      "/user/list-favorite",
      {
        params: wrapper,
      }
    );
  },
  listSubscribe(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<Page<UserSubscribeModel>>>(
      "/user/list-subscribe",
      {
        params: wrapper,
      }
    );
  },
};
