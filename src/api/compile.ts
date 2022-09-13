import { request } from "../request";
import { ApiResponse } from "./interface";

type T = ApiResponse;

export const CompilerApi = {
  compile(wrapper: { content: string; filename: string; input: string }) {
    return request.post<T>("/compiler/compile-code", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  lint(wrapper: { content: string; filename: string; input: string }) {
    return request.post<T>("/compiler/lint-code", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  save(wrapper: { content: string; filename: string }) {
    return request.post<T>("/compiler/save-code", wrapper);
  },
  listCompiles(wrapper: { code_id: string }) {
    return request.get<T>("/compiler/list-compiles", { params: wrapper });
  },
  listCodes() {
    return request.get<T>("/compiler/list-codes");
  },
  remove(wrapper: { id: string }) {
    return request.get<T>("/compiler/remove-code", { params: wrapper });
  },
};
