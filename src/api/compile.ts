import { request } from "../request";
import { ApiResponse } from "./interface";

export const CompilerApi = {
  compile(wrapper: { content: string; filename: string; input: string }) {
    return request.post<ApiResponse>("/compiler/compile-code", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  lint(wrapper: { content: string; filename: string; input: string }) {
    return request.post<ApiResponse>("/compiler/lint-code", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  save(wrapper: { content: string; filename: string }) {
    return request.post<ApiResponse>("/compiler/save-code", wrapper);
  },
  listCompiles(wrapper: { code_id: string }) {
    return request.get<ApiResponse>("/compiler/list-compiles", {
      params: wrapper,
    });
  },
  listCodes() {
    return request.get<ApiResponse>("/compiler/list-codes");
  },
  remove(wrapper: { id: string }) {
    return request.get<ApiResponse>("/compiler/remove-code", {
      params: wrapper,
    });
  },
};
