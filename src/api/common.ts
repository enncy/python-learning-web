import { request } from "../request";
import { ApiResponse } from "./interface";

export const CommonApi = {
  listConfig() {
    return request.get<
      ApiResponse<
        {
          type: string;
          key: string;
          value: string;
        }[]
      >
    >("/list-config");
  },
};
