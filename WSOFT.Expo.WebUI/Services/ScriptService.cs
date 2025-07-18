using AliceScript;
using AliceScript.Parsing;
using WSOFT.Expo.WebUI.Models;

namespace WSOFT.Expo.WebUI.Services
{
    public class ScriptService
    {
        private readonly List<ConsoleMessage> _messages = new();

        public event Action? OnMessagesChanged;
        public IReadOnlyList<ConsoleMessage> Messages => _messages.AsReadOnly();
        public ParsingScript ParentScript { get; private set; }
        public ScriptService()
        {
            AddMessage("AliceScript Runtime is initializing...", MessageType.Debug);
            Runtime.Init();
            AddMessage("[OK] AliceScript Runtime initialized successfully.", MessageType.Debug);
            Interpreter.Instance.OnOutput += (_, e) => AddMessage(e.Output, MessageType.Info);
            Interpreter.Instance.OnDebug += (_, e) => AddMessage(e.Output, MessageType.Info);
            AddMessage("[OK] AliceScript Events initialized.", MessageType.Debug);
            ThrowErrorManager.NotCatch = false;
            ThrowErrorManager.ThrowError += (_, e) =>
            {
                e.Script.SetDone();

                AddMessage($"Error : {e.ErrorCode} (0x{(int)e.ErrorCode:X3})", MessageType.Error);
                if (!string.IsNullOrEmpty(e.Message))
                    AddMessage($"        {e.Message}", MessageType.Error);
                if (!string.IsNullOrEmpty(e.HelpLink))
                    AddMessage($"   See: {e.HelpLink}", MessageType.Error);
                AddMessage($"    at: {e.Script.OriginalLine}  (line {e.Script.OriginalLineNumber + 1})", MessageType.Error);

                if (e.Script is not null && e.Script.StackTrace.Count > 0)
                {
                    AddMessage("Stack Trace:", MessageType.Error);
                    foreach (var stack in e.Script.StackTrace)
                    {
                        AddMessage($"  at {stack} at {stack.LineNumber + 1}", MessageType.Error);
                    }
                }
                e.Handled = true;
            };
            ParentScript = ParsingScript.GetTopLevelScript();
            AddMessage("[OK] Script initialized.", MessageType.Debug);
            AddMessage("AliceScriptランタイムが起動しました", MessageType.Success);
        }
        public void AddMessage(string message, MessageType type = MessageType.Info)
        {
            _messages.Add(new ConsoleMessage
            {
                Message = message,
                Type = type,
                Timestamp = DateTime.Now
            });

            OnMessagesChanged?.Invoke();
        }

        public void Clear()
        {
            _messages.Clear();
            OnMessagesChanged?.Invoke();
        }

        public async Task ExecuteScript(string code)
        {
            try
            {
                AddMessage($"Script initializing...", MessageType.Debug);
                var script = ParentScript.GetChildScript(code);
                AddMessage($"[OK] Script initialized.", MessageType.Debug);
                await Task.Run(() =>
                {
                    try
                    {
                        var result = script.Process();
                        if (result is null || result.Type == Variable.VarType.VARIABLE) return; // resultがnullの場合は、何らか処理が中断しているので成功報告を出さない
                        if (result.Type == Variable.VarType.VOID || result.Type == Variable.VarType.UNDEFINED)
                        {
                            AddMessage("Script OK.", MessageType.Success);
                            return;
                        }
                        AddMessage($"=> {result}", MessageType.Success);
                    }
                    catch (Exception ex)
                    {
                        AddMessage($"Error: {ex.Message}", MessageType.Error);
                    }
                });
            }
            catch (Exception ex)
            {
                AddMessage($"Error: {ex.Message}", MessageType.Error);
            }
        }
    }
}
