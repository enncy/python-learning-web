export function parseEntity(e: any) {
  const { createTime, updateTime, deleted, version, ...entity } = e || {};
  return entity;
}
