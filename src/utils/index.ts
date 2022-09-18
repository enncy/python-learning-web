import { config, store } from "../store";
import { Role } from "../store/interface";

/**
 * 创建弹出式登录框
 */
export function createSimplifyLoginWindow() {
  let win: Window | null;
  // @ts-ignore
  window.onLogin = (user) => {
    store.user = user;
    win?.close();
  };

  win = centeredPopup("/simplify-login", "popUpWindow", {
    width: 500,
    height: 600,
    resizable: false,
    scrollbars: true,
  });
}

/**
 * 创建弹出登录页面
 * @param url 地址
 * @param winName 窗口名
 * @param w 宽
 * @param h 高
 * @param scroll 滚动条
 */
export function centeredPopup(
  url: string,
  winName: string,
  opts: {
    width: number;
    height: number;
    scrollbars: boolean;
    resizable: boolean;
  }
) {
  const { width, height, scrollbars, resizable } = opts;
  const LeftPosition = screen.width ? (screen.width - width) / 2 : 0;
  const TopPosition = screen.height ? (screen.height - height) / 2 : 0;
  const settings =
    "height=" +
    height +
    ",width=" +
    width +
    ",top=" +
    TopPosition +
    ",left=" +
    LeftPosition +
    ",scrollbars=" +
    (scrollbars ? "yes" : "no") +
    ",resizable=" +
    (resizable ? "yes" : "no");

  return window.open(url, winName, settings);
}

export function max(str: string, len: number) {
  return str.length > len ? `${str.slice(0, len)}...` : str;
}

/** 获取权限等级 */
export function getRole(role: Role) {
  return (
    config.roles.find((r) => r.name === role) ||
    config.roles.find((r) => r.name === "visitor")!
  );
}
