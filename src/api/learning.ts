import { request } from "../request";
import { LearningArticle, LearningCategory } from "../store/interface";
import { ApiResponse } from "./interface";

export const LearningApi = {
  listCategory() {
    return request.get<ApiResponse<LearningCategory[]>>(
      "/learning/category/list"
    );
  },
  listArticle(categoryId: string) {
    return request.get<ApiResponse<LearningArticle[]>>(
      "/learning/article/list",
      { params: { categoryId } }
    );
  },
  getArticle(id: string) {
    return request.get<ApiResponse<LearningArticle>>("/learning/article/get", {
      params: { id },
    });
  },
};
