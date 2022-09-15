import { request } from "../request";
import { ApiResponse } from "./interface";

type T = ApiResponse;

export const AdminApi = {
  schema(wrapper: { tableName: string }) {
    return request.get<T>("/admin/get-schema", { params: wrapper });
  },
  data(wrapper: { tableName: string; page: number; size: number }) {
    return request.get<T>("/admin/get-data", { params: wrapper });
  },
  search(wrapper: {
    tableName: string;
    page: number;
    size: number;
    [x: string]: any;
  }) {
    return request.post<T>("/admin/search", wrapper);
  },
  create(wrapper: { tableName: string; [x: string]: any }) {
    const { tableName, ...entity } = wrapper;
    return request.post<T>("/admin/create", entity, { params: { tableName } });
  },
  update(wrapper: { tableName: string; id: string; [x: string]: any }) {
    const { tableName, ...entity } = wrapper;
    return request.post<T>("/admin/update", entity, { params: { tableName } });
  },
  remove(wrapper: { tableName: string; id: string; [x: string]: any }) {
    const { tableName, ...entity } = wrapper;
    return request.post<T>("/admin/remove", entity, { params: { tableName } });
  },
  getById(wrapper: { tableName: string; id: string }) {
    return request.get<T>("/admin/get-by-id", { params: wrapper });
  },
};
