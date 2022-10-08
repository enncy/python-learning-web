import { AxiosRequestConfig } from "axios";
import { request } from "../request";
import { Page, Schema, Statistic } from "../store/interface";
import { ApiResponse } from "./interface";
import { parseEntity } from "./utils";

export const AdminApi = {
  schema(wrapper: { tableName: string }) {
    return request.get<ApiResponse<Schema[]>>("/admin/get-schema", {
      params: wrapper,
    });
  },
  data(wrapper: { tableName: string; page: number; size: number }) {
    return request.get<ApiResponse<Page<any>>>("/admin/get-data", {
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
  create(tableName: string, entity: any) {
    return request.post<ApiResponse<boolean>>(
      "/admin/create",
      parseEntity(entity),
      {
        params: { tableName },
      }
    );
  },
  update(tableName: string, entity: any) {
    return request.post<ApiResponse<boolean>>(
      "/admin/update",
      parseEntity(entity),
      {
        params: { tableName },
      }
    );
  },
  remove(tableName: string, entity: any) {
    return request.post<ApiResponse<boolean>>(
      "/admin/remove",
      parseEntity(entity),
      {
        params: { tableName },
      }
    );
  },
  getById(wrapper: { tableName: string; id: string }) {
    return request.get<ApiResponse<any>>("/admin/get-by-id", {
      params: wrapper,
    });
  },
  statistic() {
    return request.get<ApiResponse<Statistic>>("/admin/statistic");
  },
};
