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
  /** 高级搜索 */
  advanceSearch(wrapper: { [x: string]: any }) {
    return request.post<ApiResponse<BBSPostModel[]>>(
      "/bbs/post/advance-search",
      wrapper
    );
  },
  /** 发布帖子 */
  publishPost(wrapper: { tags: string[]; post: Partial<BBSPost> }) {
    return request.post<ApiResponse<boolean>>("/bbs/post/publish", wrapper);
  },
  /** 发布评论 */
  publishComment(wrapper: { [x: string]: any }) {
    return request.post<ApiResponse<boolean>>("/bbs/comment/publish", wrapper);
  },
  /** 获取评论 */
  listComment(wrapper: { postId: string; page: number; size: number }) {
    return request.get<ApiResponse<boolean>>("/bbs/comment/list", {
      params: wrapper,
    });
  },
  /** 删除评论 */
  removeComment(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/bbs/comment/remove", {
      params: wrapper,
    });
  },
  /** 删除帖子 */
  removePost(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/bbs/post/remove", {
      params: wrapper,
    });
  },
  /** 精华帖子 */
  recommend(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/bbs/post/recommend", {
      params: wrapper,
    });
  },
  /** 封禁帖子 */
  banPost(wrapper: { id: string }) {
    return request.get<ApiResponse<boolean>>("/bbs/post/ban", {
      params: wrapper,
    });
  },
  /** 修改版块分区 */
  updateCategory(wrapper: { id: string; description: string }) {
    return request.post<ApiResponse<boolean>>(
      "/bbs/admin/update-category",
      wrapper
    );
  },
};
