import {
  BBSBoardModel,
  BBSCategoryModel,
  BBSPost,
  BBSPostModel,
} from "./../store/interface";
import { request } from "../request";
import { ApiResponse } from "./interface";

export const BBSApi = {
  listBoard() {
    return request.get<ApiResponse<BBSBoardModel[]>>("/bbs/board/list");
  },
  getCategoryModel(wrapper: { id: string; page: number; size: number }) {
    return request.get<ApiResponse<BBSCategoryModel>>("/bbs/category/model", {
      params: wrapper,
    });
  },
  listGlobalPosts(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<BBSPostModel[]>>("/bbs/post/list-global", {
      params: wrapper,
    });
  },
  listPostModel(wrapper: { page: number; size: number }) {
    return request.get<ApiResponse<BBSPostModel[]>>("/bbs/post/list", {
      params: wrapper,
    });
  },
  getPostModel(wrapper: { id: string; page: number; size: number }) {
    return request.get<ApiResponse<BBSPostModel>>("/bbs/post/model", {
      params: wrapper,
    });
  },
  advanceSearch(wrapper: { [x: string]: any }) {
    return request.post<ApiResponse<BBSPostModel[]>>(
      "/bbs/post/advance-search",
      wrapper
    );
  },
  publishPost(wrapper: { tags: string[]; post: Partial<BBSPost> }) {
    return request.post<ApiResponse<boolean>>("/bbs/post/publish", wrapper);
  },

  publishComment(wrapper: { [x: string]: any }) {
    return request.post<ApiResponse<boolean>>("/bbs/comment/publish", wrapper);
  },
  listComment(wrapper: { postId: string; page: number; size: number }) {
    return request.get<ApiResponse<boolean>>("/bbs/comment/list", {
      params: wrapper,
    });
  },
  removeComment(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/bbs/comment/remove", {
      params: wrapper,
    });
  },
  removePost(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/bbs/post/remove", {
      params: wrapper,
    });
  },
};
