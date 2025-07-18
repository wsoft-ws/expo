// コンソールを一番下までスクロールする関数
window.scrollToBottom = (element) => {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

// ページが読み込まれた時の初期化
window.blazorCulture = {
  get: () => window.localStorage["BlazorCulture"],
  set: (value) => (window.localStorage["BlazorCulture"] = value),
};
