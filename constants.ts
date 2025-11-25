export const TRANSLATIONS = {
  en: {
    stringSelect: "STRING SELECT",
    auto: "AUTO",
    listening: "Listening...",
    paused: "Paused",
    ready: "Ready",
    perfect: "Perfect",
    flat: "Flat",
    sharp: "Sharp",
    pluckString: "Pluck a string",
    pressPlay: "Press Play",
    toStart: "to start listening",
    low: "Low",
    high: "High",
    appName: "iTune",
    dateFormat: "en-US",
    footerDedication: "Dedicated to every guitar lover",
    help: "Help",
    back: "Back",
    helpTitle: "Troubleshooting",
    helpContent: [
      "If the app cannot hear your guitar, please try the following steps (e.g. for Xiaomi phones):",
      "1. Open Phone Settings",
      "2. Find 'Apps' or 'Manage Apps'",
      "3. Search for 'iGuitarTuner'",
      "4. Tap the app and find 'Permissions'",
      "5. Find 'Microphone' and select 'Allow only while using' or similar.",
      "Then it should work properly."
    ]
  },
  zh: {
    stringSelect: "选择琴弦",
    auto: "自动",
    listening: "正在监听...",
    paused: "已暂停",
    ready: "准备就绪",
    perfect: "音准完美",
    flat: "音偏低",
    sharp: "音偏高",
    pluckString: "请拨动琴弦",
    pressPlay: "按播放键",
    toStart: "开始调音",
    low: "低音",
    high: "高音",
    appName: "爱调音",
    dateFormat: "zh-CN",
    footerDedication: "送给每一个吉他爱好者",
    help: "帮助",
    back: "返回",
    helpTitle: "常见问题",
    helpContent: [
      "如果您发现app无法听到吉他的声音， 也许您需要尝试以下步骤（以小米手机为例）：",
      "1. 打开手机的设置",
      "2. 找到“应用设置”",
      "3. 搜索“iGuitarTuner”",
      "4. 点击应用，找到“权限管理”",
      "5. 找到“麦克风”选项，选择“仅在使用中允许”或者类似的允许选项。",
      "然后就应该可以正常运行了。"
    ]
  }
};

export type Language = 'en' | 'zh';