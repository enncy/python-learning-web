import { request } from "../request";
import { ApiResponse } from "./interface";

type T = ApiResponse;

export const CompilerApi = {
  compile(wrapper: { content: string; filename: string; input: string }) {
    return request.post<T>("/compile-code", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  lint(wrapper: { content: string; filename: string; input: string }) {
    return request.post<T>("/lint-code", wrapper, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  save(wrapper: { content: string; filename: string }) {
    return request.post<T>("/save-code", wrapper);
  },
  listCompiles(wrapper: { code_id: string }) {
    return request.get<T>("/list-compiles", { params: wrapper });
  },
  listCodes() {
    return request.get<T>("/list-codes");
  },
  remove(wrapper: { id: string }) {
    return request.get<T>("/remove-code", { params: wrapper });
  },
};
