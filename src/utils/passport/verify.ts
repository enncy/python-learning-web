import { message } from "ant-design-vue";
import { UserApi } from "../../api/user";

/**
 * 判断对象字段的值中是否存在空格
 * @param obj
 */
export function hasBlank(obj: any) {
  // @ts-ignore
  return Object.keys(obj).some((key) => / /.test(obj[key]));
}

/**
 * 重置对象中的所以字段值为空字符串
 * @param obj
 */
export function resetObject(obj: any) {
  // @ts-ignore
  Object.keys(obj).forEach((key) => {
    obj[key] = "";
  });
}

/**
 * 发送验证码
 */
export function sendVerifyCode(
  e: any,
  formElement: HTMLFormElement,
  formData: { email: string; [x: string]: any }
) {
  e.preventDefault();

  if (formElement.checkValidity()) {
    if (hasBlank(formData)) {
      message.error("填写的信息中不能有空格");
    } else {
      UserApi.sendVerifyCode({
        email: formData.email,
      }).then(({ data: { data, msg } }) => {
        if (data) {
          message.success("验证码发送成功，请尽快验证！");
        }
      });
    }
  }
  return false;
}
