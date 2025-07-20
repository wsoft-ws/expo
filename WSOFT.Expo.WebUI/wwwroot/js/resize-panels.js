// パネルリサイズ機能
class PanelResizer {
  constructor() {
    this.isResizing = false;
    this.currentResizer = null;
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;
    this.minPanelSize = 200; // 最小パネルサイズ (px)
    this.resizeThrottleTimer = null; // スロットリング用タイマー

    this.initializeResizers();
  }

  initializeResizers() {
    // 横方向のリサイザー（エディタとキャンバス間）
    this.createHorizontalResizer();

    // 縦方向のリサイザー（上部セクションとコンソール間）
    this.createVerticalResizer();

    // イベントリスナーを設定
    this.setupEventListeners();
  }

  createHorizontalResizer() {
    const upperSection = document.querySelector(".upper-section");
    if (!upperSection) return;

    const resizer = document.createElement("div");
    resizer.className = "horizontal-resizer";
    resizer.setAttribute("data-direction", "horizontal");

    // エディタセクションとキャンバスセクション間に挿入
    const editorSection = document.querySelector(".editor-section");
    const canvasSection = document.querySelector(".canvas-section");

    if (editorSection && canvasSection) {
      upperSection.insertBefore(resizer, canvasSection);
    }
  }

  createVerticalResizer() {
    const container = document.querySelector(".script-runner-container");
    if (!container) return;

    const resizer = document.createElement("div");
    resizer.className = "vertical-resizer";
    resizer.setAttribute("data-direction", "vertical");

    // 上部セクションとコンソールセクション間に挿入
    const upperSection = document.querySelector(".upper-section");
    const consoleSection = document.querySelector(".console-section");

    if (upperSection && consoleSection) {
      container.insertBefore(resizer, consoleSection);
    }
  }

  setupEventListeners() {
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    // ウィンドウリサイズ時の処理
    window.addEventListener("resize", this.handleWindowResize.bind(this));
  }

  handleMouseDown(e) {
    if (
      !e.target.classList.contains("horizontal-resizer") &&
      !e.target.classList.contains("vertical-resizer")
    ) {
      return;
    }

    this.isResizing = true;
    this.currentResizer = e.target;
    this.startX = e.clientX;
    this.startY = e.clientY;

    const direction = this.currentResizer.getAttribute("data-direction");

    if (direction === "horizontal") {
      const editorSection = document.querySelector(".editor-section");
      this.startWidth = editorSection.offsetWidth;
    } else if (direction === "vertical") {
      const upperSection = document.querySelector(".upper-section");
      this.startHeight = upperSection.offsetHeight;
    }

    document.body.style.cursor =
      direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";

    e.preventDefault();
  }

  handleMouseMove(e) {
    if (!this.isResizing || !this.currentResizer) return;

    const direction = this.currentResizer.getAttribute("data-direction");

    if (direction === "horizontal") {
      this.resizeHorizontal(e);
    } else if (direction === "vertical") {
      this.resizeVertical(e);
    }
  }

  resizeHorizontal(e) {
    const container = document.querySelector(".upper-section");
    const editorSection = document.querySelector(".editor-section");
    const canvasSection = document.querySelector(".canvas-section");

    if (!container || !editorSection || !canvasSection) return;

    const deltaX = e.clientX - this.startX;
    const newEditorWidth = this.startWidth + deltaX;
    const containerWidth = container.offsetWidth;

    // 最小/最大幅の制限
    const minWidth = this.minPanelSize;
    const maxWidth = containerWidth - this.minPanelSize - 4; // リサイザーの幅を考慮

    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newEditorWidth));
    const editorPercentage = (clampedWidth / containerWidth) * 100;
    const canvasPercentage = 100 - editorPercentage;

    editorSection.style.width = `${editorPercentage}%`;
    canvasSection.style.width = `${canvasPercentage}%`;

    // リサイズ中にもMonaco Editorの更新を行う（パフォーマンスのため間引き）
    if (!this.resizeThrottleTimer) {
      this.resizeThrottleTimer = setTimeout(() => {
        this.notifyMonacoResize();
        this.resizeThrottleTimer = null;
      }, 100);
    }
  }

  resizeVertical(e) {
    const container = document.querySelector(".script-runner-container");
    const upperSection = document.querySelector(".upper-section");
    const consoleSection = document.querySelector(".console-section");

    if (!container || !upperSection || !consoleSection) return;

    const deltaY = e.clientY - this.startY;
    const newUpperHeight = this.startHeight + deltaY;
    const containerHeight = container.offsetHeight;

    // 最小/最大高さの制限
    const minHeight = this.minPanelSize;
    const maxHeight = containerHeight - this.minPanelSize - 4; // リサイザーの高さを考慮

    const clampedHeight = Math.max(
      minHeight,
      Math.min(maxHeight, newUpperHeight)
    );
    const upperPercentage = (clampedHeight / containerHeight) * 100;
    const consolePercentage = 100 - upperPercentage;

    upperSection.style.height = `${upperPercentage}%`;
    consoleSection.style.height = `${consolePercentage}%`;

    // リサイズ中にもMonaco Editorの更新を行う（パフォーマンスのため間引き）
    if (!this.resizeThrottleTimer) {
      this.resizeThrottleTimer = setTimeout(() => {
        this.notifyMonacoResize();
        this.resizeThrottleTimer = null;
      }, 100);
    }
  }

  handleMouseUp() {
    this.isResizing = false;
    this.currentResizer = null;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    // リサイズ完了時にもMonaco Editorを更新
    this.notifyMonacoResize();
  }

  handleWindowResize() {
    // ウィンドウサイズ変更時に比率を維持
    const container = document.querySelector(".script-runner-container");
    if (!container) return;

    // Monaco Editorのリサイズを通知
    this.notifyMonacoResize();
  }

  // Monaco Editorのリサイズ通知
  notifyMonacoResize() {
    // Blazorコンポーネントへのリサイズ通知
    if (window.dotNetReference) {
      try {
        window.dotNetReference.invokeMethodAsync("NotifyEditorResize");
      } catch (error) {
        console.warn("Failed to notify editor resize:", error);
      }
    }

    // Monaco Editor への直接通知（フォールバック）
    if (window.monacoEditor) {
      setTimeout(() => {
        try {
          window.monacoEditor.layout();
        } catch (error) {
          console.warn("Failed to layout monaco editor:", error);
        }
      }, 100);
    }
  }

  // 外部から呼び出し可能なリサイズ通知メソッド
  notifyResize() {
    this.handleWindowResize();
  }
}

// グローバルインスタンスを作成
window.panelResizer = null;

// DOMContentLoaded後に初期化
document.addEventListener("DOMContentLoaded", function () {
  // 少し遅延させてからリサイザーを初期化（他のコンポーネントが読み込まれた後）
  setTimeout(() => {
    window.panelResizer = new PanelResizer();
  }, 500);
});

// Blazorからの再初期化用
window.initializePanelResizer = function () {
  if (window.panelResizer) {
    return;
  }
  setTimeout(() => {
    window.panelResizer = new PanelResizer();
  }, 100);
};

// パネルリサイズ通知
window.notifyPanelResize = function () {
  if (window.panelResizer) {
    window.panelResizer.notifyResize();
  }
};
