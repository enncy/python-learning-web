import { message } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { request } from "../request";
import { config, store } from "../store";
import { SystemResource } from "../store/interface";
import { ApiResponse } from "./interface";

const DEFAULT_CHUNK_SIZE = 10 * 1024 * 1024;

export const ResourceApi = {
  remove(id: string) {
    return request.get<ApiResponse<boolean>>("/remove-resource", {
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
  init(
    entity: Pick<SystemResource, "filename" | "folder" | "invalid" | "id"> & {
      resource: File;
    }
  ) {
    const formData = new FormData();
    // 秒传
    if (entity.resource) {
      formData.append("originalName", entity.resource.name);
      formData.append("size", entity.resource.size.toString());
      formData.append("type", entity.resource.type);
    }

    formData.append("folder", entity.folder);
    formData.append("invalid", (entity.invalid ? 1 : 0).toString());
    formData.append("filename", entity.filename);
    formData.append("id", entity.id);
    return request.post<ApiResponse<boolean>>("/init-resource", formData);
  },
  async upload(id: string, file: File) {
    const fileChunks = createFileChunk(file);
    // 标记开始上传
    store.upload.status[id] = 1;

    for (let i = 0; i < fileChunks.length; i++) {
      // 1 为继续上传， 0 为暂停上传
      if (store.upload.status[id] === 1) {
        const chunk = fileChunks[i];

        const formData = new FormData();
        formData.append("file", chunk.file);
        formData.append("chunkNumber", i.toString());
        formData.append("currentChunkSize", chunk.file.size.toString());
        formData.append("totalChunks", fileChunks.length.toString());
        formData.append("id", id);

        const start = Date.now();
        // 上传
        await request.post<ApiResponse<boolean>>("/upload-resource", formData);
        const consume = Date.now() - start;
        // 计算网速
        const networkRate = DEFAULT_CHUNK_SIZE / (consume / 1000);
        // 计算上传进度
        store.upload.percents[id] = Math.floor((i / fileChunks.length) * 100);
        store.upload.rates[id] = Math.floor(networkRate);
      } else {
        return false;
      }
    }
    return true;
  },
};

function createFileChunk(file: File, size = DEFAULT_CHUNK_SIZE) {
  const fileChunkList = [];
  var count = 0;
  while (count < file.size) {
    fileChunkList.push({
      file: file.slice(count, count + size),
    });
    count += size;
  }
  return fileChunkList;
}

export async function uploadResource(
  entity: Pick<SystemResource, "filename" | "folder" | "invalid" | "id"> & {
    resource: File;
  }
) {
  // 初始化资源
  await ResourceApi.init(entity);
  if (entity.resource) {
    // 上传资源
    const finished = await ResourceApi.upload(entity.id, entity.resource);
    if (finished) {
      message.success("上传成功");
      return true;
    } else {
      // 删除被中断的资源文件
      await ResourceApi.remove(entity.id);
      message.warn("已暂停上传");
      return false;
    }
  } else {
    return true;
  }
}
