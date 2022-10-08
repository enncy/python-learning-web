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

/**
 * 根据指定的t，获取t距离现在过去了多少天
 * @param t     指定的时间
 * @return {any} elapsed 过去的时间
 */
export function getElapsedTime(t: number) {
  let now = Date.now();
  let elapsed = now - t;
  let result = "";
  let second = 1000;
  let minute = 60 * second;
  let hours = 60 * minute;
  let day = 24 * hours;
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let nowYear = new Date(now).getFullYear();
  let nowMonth = new Date(now).getMonth();
  //判断是不是闰年
  if ((nowYear % 4 === 0 && nowYear % 100 !== 0) || nowYear % 400 === 0)
    months[1] = 29;
  let month = Math.abs(new Date(t).getMonth() - nowMonth);
  let year = nowYear - new Date(t).getFullYear();

  if (year !== 0 && month >= 12) result = year + "年";
  else if (month !== 0 && Math.round(elapsed / day) >= months[nowMonth])
    return month + "个月";
  else if (parse(day) !== 0) result = parse(day) + "天";
  else if (parse(hours) !== 0) result = parse(hours) + "小时";
  else if (parse(minute) !== 0) result = parse(minute) + "分钟";
  else if (parse(second) !== 0) result = parse(second) + "秒";
  else if (parse(1) !== 0) result = parse(1) + "毫秒";
  else result = "0毫秒";

  function parse(time: number) {
    return Math.round(elapsed / time);
  }
  return result;
}

export function uuid() {
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );

  return id.replace(/-/g, "");
}
