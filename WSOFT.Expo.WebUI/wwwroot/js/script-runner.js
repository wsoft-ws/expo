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

// ファイルダウンロード機能
window.downloadText = (text, filename) => {
  const element = document.createElement("a");
  const file = new Blob([text], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

// ファイル保存ダイアログ（File System Access API使用）
window.saveFileWithDialog = async (text, defaultFilename) => {
  try {
    // File System Access APIがサポートされているかチェック
    if ("showSaveFilePicker" in window) {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: defaultFilename,
        types: [
          {
            description: "AliceScript files",
            accept: {
              "text/alice": [".alice"],
            },
          },
          {
            description: "Text files",
            accept: {
              "text/plain": [".txt"],
            },
          },
          {
            description: "JavaScript files",
            accept: {
              "text/javascript": [".js"],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(text);
      await writable.close();

      return {
        success: true,
        filename: fileHandle.name,
        message: "ファイルが保存されました",
      };
    } else {
      // File System Access APIがサポートされていない場合はフォールバック
      window.downloadText(text, defaultFilename);
      return {
        success: true,
        filename: defaultFilename,
        message:
          "ファイルがダウンロードされました（ブラウザの制限により保存先を選択できません）",
      };
    }
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        success: false,
        filename: "",
        message: "ファイル保存がキャンセルされました",
      };
    } else {
      // エラーの場合はフォールバック
      window.downloadText(text, defaultFilename);
      return {
        success: true,
        filename: defaultFilename,
        message:
          "ファイルがダウンロードされました（保存エラーのためフォールバック）",
      };
    }
  }
};

// ファイル入力の処理
window.getFileInputFiles = (fileInput) => {
  return fileInput.files[0] || null;
};

window.readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

window.getFileName = (file) => {
  return file.name;
};

// InputFileコンポーネントをクリックする
window.triggerFileInputClick = (element) => {
  if (element) {
    element.click();
  }
};

// ファイル選択ダイアログを開く
window.triggerFileInput = (fileInput) => {
  if (fileInput) {
    fileInput.click();
  }
};

// 現在のスクリプト内容を取得
window.getCurrentScriptContent = () => {
  const textarea = document.querySelector(".editor-textarea");
  return textarea ? textarea.value : "";
};

// フルスクリーン切り替え
window.toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// キーボードショートカットの設定
window.setupKeyboardShortcuts = () => {
  document.addEventListener("keydown", function (e) {
    // Ctrl + N で新規スクリプト
    if (e.ctrlKey && e.key === "n") {
      e.preventDefault();
      const event = new CustomEvent("newScript");
      document.dispatchEvent(event);
    }

    // Ctrl + O でファイルを開く
    if (e.ctrlKey && e.key === "o") {
      e.preventDefault();
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.click();
      }
    }

    // Ctrl + Shift + S で名前を付けて保存
    if (e.ctrlKey && e.shiftKey && e.key === "S") {
      e.preventDefault();
      const event = new CustomEvent("saveAs");
      document.dispatchEvent(event);
    }

    // Ctrl + Shift + K でエディタをクリア
    if (e.ctrlKey && e.shiftKey && e.key === "K") {
      e.preventDefault();
      const event = new CustomEvent("clearEditor");
      document.dispatchEvent(event);
    }

    // Ctrl + L でコンソールクリア
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      const event = new CustomEvent("clearConsole");
      document.dispatchEvent(event);
    }

    // F11 でフルスクリーン切り替え
    if (e.key === "F11") {
      e.preventDefault();
      window.toggleFullscreen();
    }
  });
};

// キーボードショートカットの処理（旧）
document.addEventListener("keydown", function (e) {
  // Ctrl + L でコンソールクリア
  if (e.ctrlKey && e.key === "l") {
    e.preventDefault();
    const event = new CustomEvent("clearConsole");
    document.dispatchEvent(event);
  }

  // F11 でフルスクリーン切り替え
  if (e.key === "F11") {
    e.preventDefault();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
});

// Bootstrap初期化（ドロップダウンなどのため）
document.addEventListener("DOMContentLoaded", function () {
  // Bootstrap Dropdownの初期化
  if (typeof bootstrap !== "undefined") {
    var dropdownElementList = [].slice.call(
      document.querySelectorAll(".dropdown-toggle")
    );
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl);
    });
  }
});
