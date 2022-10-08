import { request } from "../request";
import { config } from "../store";
import { SystemResource } from "../store/interface";
import { ApiResponse } from "./interface";

export const ResourceApi = {
  async upload(
    entity: Pick<SystemResource, "filename" | "folder" | "invalid" | "id"> & {
      absolutePath?: string;
      resource?: File;
    }
  ) {
    const formData = new FormData();
    if (entity.absolutePath) {
      //
    } else if (entity.resource) {
      formData.append("file", entity.resource);
    }
    formData.append("folder", entity.folder);
    formData.append("invalid", (entity.invalid ? 1 : 0).toString());
    formData.append("filename", entity.filename);
    formData.append("id", entity.id);

    return request.post<ApiResponse<boolean>>("/resource-upload", formData);
  },
  remove(id: string) {
    return request.get<ApiResponse<boolean>>("/resource-remove", {
      params: { id },
    });
  },
  of(wrapper: { id?: string; filename?: string }): string {
    const { id, filename } = wrapper;
    return id
      ? `${config.baseURL}/resource?id=${id}`
      : filename
      ? `${config.baseURL}/resource?id=${filename}`
      : ``;
  },
};

async function createFile(url: string, filename: string, type: string) {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type,
  };
  return new File([data], filename, metadata);
}
