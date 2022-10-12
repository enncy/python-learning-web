import { max } from ".";

export function booleanRender({ value }: any) {
  return !!value ? "是" : "-";
}

export function maxRender({ value }: any) {
  return value ? max(value, 20) : "---";
}
