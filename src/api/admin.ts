import { request } from "../request";
import { Schema } from "../store/interface";
import { ApiResponse } from "./interface";
import { parseEntity } from "./utils";

export const AdminApi = {
  schema(wrapper: { tableName: string }) {
    return request.get<ApiResponse<Schema[]>>("/admin/get-schema", {
      params: wrapper,
    });
  },
  data(wrapper: { tableName: string; page: number; size: number }) {
    return request.get<ApiResponse<any[]>>("/admin/get-data", {
      params: wrapper,
    });
  },
  search(wrapper: {
    tableName: string;
    page: number;
    size: number;
    [x: string]: any;
  }) {
    return request.post<ApiResponse<any[]>>("/admin/search", wrapper);
  },
  create(wrapper: { tableName: string; [x: string]: any }) {
    const { tableName, ...entity } = parseEntity(wrapper);
    return request.post<ApiResponse<boolean>>("/admin/create", entity, {
      params: { tableName },
    });
  },
  update(wrapper: { tableName: string; id: string; [x: string]: any }) {
    const { tableName, ...entity } = parseEntity(wrapper);
    return request.post<ApiResponse<boolean>>("/admin/update", entity, {
      params: { tableName },
    });
  },
  remove(wrapper: { tableName: string; id: string; [x: string]: any }) {
    const { tableName, ...entity } = parseEntity(wrapper);
    return request.post<ApiResponse<boolean>>("/admin/remove", entity, {
      params: { tableName },
    });
  },
  getById(wrapper: { tableName: string; id: string }) {
    return request.get<ApiResponse<any>>("/admin/get-by-id", {
      params: wrapper,
    });
  },
};
