import { request } from "../request";
import { ApiResponse } from "./interface";

export const UploadApi = {
  avatar(form: FormData) {
    return request.post<ApiResponse<boolean>>("/upload-avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
