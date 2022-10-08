export function parseEntity(e: any) {
  if (e instanceof FormData) {
    e.delete("createTime");
    e.delete("updateTime");
    e.delete("deleted");
    e.delete("version");
    return e;
  } else {
    const { createTime, updateTime, deleted, version, ...entity } = e || {};
    return entity;
  }
}
