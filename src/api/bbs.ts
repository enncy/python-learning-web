import { request } from "../request";
import { ApiResponse } from "./interface";

type T = ApiResponse;

export const BBSApi = {
  listBoard() {
    return request.get<T>("/bbs/board/list");
  },
  getCategoryModel(wrapper: { id: string }) {
    return request.get<T>("/bbs/category/model", { params: wrapper });
  },
  listPost(wrapper: { page: number; size: number }) {
    return request.get<T>("/bbs/post/list", { params: wrapper });
  },
  getPostModel(wrapper: { page: number; size: number }) {
    return request.get<T>("/bbs/post/model", { params: wrapper });
  },
};
