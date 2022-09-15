import { defineAsyncComponent, reactive, shallowRef } from "vue";
import monaco from "monaco-editor";
import { Code, Compile, User } from "./interface";

export const config = reactive({
  version: 18,
  name: "Python学习网",
  copyright: "Copyright © 2022 Python学习网",
  description:
    "Python学习网 —— 拥有在线学习系统，在线代码测评系统，以及论坛系统，可以自学Python，对各种例子进行自测，与各大网友分享技术，共同建造和谐的开源社区",
  // 自适应宽度
  adaption: {
    breaking_point: 1000,
  },
  headers: [
    {
      component: shallowRef(
        defineAsyncComponent(() => import("../components/common/Logo.vue"))
      ),
    },
    {
      path: "/learning",
      name: "教程",
      icon: "icon-book",
      //  自适应
      class: "d-none d-lg-block",
      //  自适应
      adaption: true,
    },

    {
      path: "/bbs/board",
      name: "论坛",
      icon: "icon-earth",
      class: "d-none d-lg-block",
      adaption: true,
    },
    {
      path: "/complier",
      name: "在线编译器",
      icon: "icon-code",
      class: "d-none d-lg-block",
      adaption: true,
      divider: true,
    },
    {
      component: shallowRef(
        defineAsyncComponent(
          () => import("../components/common/SearchInput.vue")
        )
      ),
      class: "d-none d-lg-block",
    },
    {
      component: shallowRef(
        defineAsyncComponent(
          () => import("../components/common/UserHeaderItem.vue")
        )
      ),
      class:
        "d-lg-block justify-content-end justify-content-lg-center d-flex user-menus-wrapper",
    },
    {
      path: "/user/message",
      name: "消息",
      class: "d-none d-lg-block",
      icon: "icon-comment",
      adaption: true,
    },
    {
      path: "/user/notify",
      name: "通知",
      icon: "icon-sound",
      class: "d-none d-lg-block",
      adaption: true,
    },
  ],
  userMenus: {
    user: [
      {
        redirect: "/@",
        name: "个人首页",
        icon: "icon-home",
      },
      {
        path: "/user/information",
        name: "个人资料",
        icon: "icon-user",
      },
      {
        path: "/user/bbs",
        name: "我的论坛",
        icon: "icon-comment",
      },
      {
        path: "/user/learning",
        name: "我的学习",
        icon: "icon-book",
      },

      {
        path: "/logout",
        name: "退出",
        icon: "icon-logout",
      },
    ],
    visitor: [
      {
        path: "/login",
        name: "登录",
        icon: "icon-login",
      },
      {
        path: "/register",
        name: "注册",
        icon: "icon-adduser",
      },
    ],
    admin: [
      {
        path: "/admin",
        name: "后台管理",
        icon: "icon-piechart",
      },
    ],
  } as Record<string, any>,

  compiler: {
    editor: {
      templates: [
        {
          name: "空白文件",
          content: "",
        },
        {
          name: "数字求和",
          content: `# 用户输入数字
          num1 = input('输入第一个数字：')
          num2 = input('输入第二个数字：')
           
          # 求和
          sum = float(num1) + float(num2)
           
          # 显示计算结果
          print('数字 {0} 和 {1} 相加结果为： {2}'.format(num1, num2, sum))`,
        },
        {
          name: "随机数生成",
          content: `# 生成 0 ~ 9 之间的随机数
 
          # 导入 random(随机数) 模块
          import random
           
          print(random.randint(0,9))`,
        },
        {
          name: "九九乘法表",
          content: `# 九九乘法表
          for i in range(1, 10):
              for j in range(1, i+1):
                  print('{}x{}={}\t'.format(j, i, i*j), end='')
              print()`,
        },
        {
          name: "生成日历",
          content: `# 引入日历模块
          import calendar
           
          # 输入指定年月
          yy = int(input("输入年份: "))
          mm = int(input("输入月份: "))
           
          # 显示日历
          print(calendar.month(yy,mm))`,
        },
        {
          name: "冒泡排序",
          content: `def bubbleSort(arr):
          n = len(arr)
       
          # 遍历所有数组元素
          for i in range(n):
       
              # Last i elements are already in place
              for j in range(0, n-i-1):
       
                  if arr[j] > arr[j+1] :
                      arr[j], arr[j+1] = arr[j+1], arr[j]
       
      arr = [64, 34, 25, 12, 22, 11, 90]
       
      bubbleSort(arr)
       
      print ("排序后的数组:")
      for i in range(len(arr)):
          print ("%d" %arr[i]),`,
        },
      ],
    },

    defaultCode: {
      id: Date.now().toString(),
      filename: "未命名1",
      content:
        "# 编辑你的 python 代码，并点击右上角运行按钮即可运行。\nprint('hello world')",
    },
    defaultCompile: {
      codeId: Date.now().toString(),
      errorMessage: "",
      codeContent: "",
      output: "",
      input: "",
      timeConsuming: 0,
    },
  },
});

// 用户可参与修改的数据, 并且储存在浏览器中。
export const store = reactive({
  user: undefined as User | undefined,
  compiler: {
    currentTag: config.compiler.defaultCode.filename,
    codes: [config.compiler.defaultCode] as Code[],
    compiles: [config.compiler.defaultCompile] as Compile[],
  },
  editor: {
    options: {
      value: "",
      language: "python",
      theme: "vs-dark",
      selectOnLineNumbers: true, //显示行号
      roundedSelection: true, // 选中的行背景样式变成圆角边框
      cursorStyle: "line", //光标样式
      glyphMargin: false, //字形边缘
      useTabStops: false,
      fontSize: 16, //字体大小
      quickSuggestionsDelay: 100, //代码提示延时
      automaticLayout: true,
      autoIndent: "advanced",
      tabSize: 4,
    } as monaco.editor.IStandaloneEditorConstructionOptions,
    themes: ["vs-light", "vs-dark", "hc-light", "hc-black"],
    languages: ["python", "javascript", "css", "html"],
    fontSizeRange: [12, 14, 16, 18, 20],
    tabSizeRange: [2, 4],
  },
});