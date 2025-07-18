# WSOFT.Expo.WebUI - GitHub Copilot Agent引き継ぎドキュメント

## プロジェクト概要

**目的**: AliceScriptランタイムを統合したBlazor WebAssemblyベースのスクリプト実行環境
**技術スタック**: .NET 9.0, Blazor WebAssembly, AliceScript, Bootstrap
**作成日**: 2025年7月19日

## プロジェクト構造

```
WSOFT.Expo.WebUI/
├── Components/
│   ├── ScriptEditor.razor        # スクリプト入力エディタコンポーネント
│   └── ConsolePanel.razor        # コンソール出力表示コンポーネント
├── Models/
│   └── ConsoleMessage.cs         # コンソールメッセージモデル
├── Services/
│   └── ScriptService.cs          # AliceScript実行エンジンサービス
├── Pages/
│   └── ScriptRunner.razor        # メインのスクリプト実行ページ
├── Layout/
│   ├── MainLayout.razor          # メインレイアウト
│   └── NavMenu.razor             # ナビゲーションメニュー
└── wwwroot/
    ├── css/script-runner.css     # スクリプトランナー専用CSS
    └── js/script-runner.js       # JavaScript補助関数
```

## 主要機能

### 1. ScriptEditor コンポーネント
- **場所**: `Components/ScriptEditor.razor`
- **機能**: 
  - AliceScriptコードの入力
  - シンタックスハイライト風のダークテーマ
  - Ctrl+Enter での実行
  - クリア機能
- **イベント**: `OnExecuteScript` - スクリプト実行時に発火

### 2. ConsolePanel コンポーネント
- **場所**: `Components/ConsolePanel.razor`
- **機能**:
  - リアルタイムメッセージ表示
  - メッセージタイプ別色分け (Info/Success/Warning/Error/Debug)
  - タイムスタンプ表示
  - 自動スクロール
  - コンソールクリア
- **依存**: `ScriptService`、`IJSRuntime`

### 3. ScriptService サービス
- **場所**: `Services/ScriptService.cs`
- **機能**:
  - AliceScript ランタイムの初期化と管理
  - スクリプト実行エンジン
  - コンソールメッセージ管理
  - リアルタイムイベント通知
- **重要な実装**:
  - AliceScript の `Runtime.Init()` による初期化
  - エラーハンドリングとスタックトレース表示
  - `ParentScript` によるスクリプトコンテキスト管理

## AliceScript 統合詳細

### 初期化フロー
1. `Runtime.Init()` でAliceScriptランタイム初期化
2. `Interpreter.Instance` のイベントハンドラー設定
3. `ThrowErrorManager` によるエラーハンドリング設定
4. `ParsingScript.GetTopLevelScript()` でルートスクリプト取得

### スクリプト実行フロー
1. ユーザーがエディターでコード入力
2. `ScriptEditor` が `OnExecuteScript` イベント発火
3. `ScriptService.ExecuteScript()` が呼び出される
4. `ParentScript.GetChildScript()` で子スクリプト作成
5. `script.Process()` でスクリプト実行
6. 結果を `ConsolePanel` に表示

## 依存関係

### NuGetパッケージ
- `Microsoft.AspNetCore.Components.WebAssembly` (9.0.6)
- `Microsoft.AspNetCore.Components.WebAssembly.DevServer` (9.0.6)
- AliceScript関連パッケージ（ユーザーが手動追加）

### サービス登録 (Program.cs)
```csharp
builder.Services.AddSingleton<ScriptService>();
```

## 重要な設計決定

1. **ScriptService をシングルトンで登録**: スクリプトコンテキストとメッセージ履歴を保持
2. **AliceScript の統合**: JavaScript風の構文をサポート
3. **リアルタイム通知**: `event Action OnMessagesChanged` によるリアクティブUI
4. **エラーハンドリング**: 詳細なスタックトレースとエラーコード表示
5. **コンポーネント分離**: エディターとコンソールを独立したコンポーネントとして設計

## 実行方法

```bash
cd WSOFT.Expo.WebUI
dotnet run --urls "https://localhost:7001;http://localhost:7000"
```

アクセス: `https://localhost:7001/script-runner`

## 既知の制約

1. AliceScriptの実行はクライアントサイド（WebAssembly）で行われる
2. ファイルI/Oなどのシステムリソースアクセスは制限される
3. スクリプトの実行コンテキストは単一のParentScriptインスタンスで管理

## トラブルシューティング

### よくある問題
1. **AliceScriptランタイムエラー**: `Runtime.Init()` の実行確認
2. **コンソール表示されない**: `ScriptService` の依存性注入確認
3. **スクロールが動作しない**: `script-runner.js` の読み込み確認

### デバッグ情報
- コンソールメッセージに `MessageType.Debug` でランタイム情報出力
- ブラウザの開発者ツールでJavaScriptエラー確認
- `ThrowErrorManager` による詳細エラー情報表示

## 次期開発時の注意点

1. AliceScriptの更新時は初期化フローの確認が必要
2. 新機能追加時は `ScriptService` の拡張を検討
3. UIの改善時は `script-runner.css` を活用
4. パフォーマンス改善時は `ParentScript` の管理方法を見直し

---
*このドキュメントは GitHub Copilot Agent の引き継ぎ用に作成されました。*
