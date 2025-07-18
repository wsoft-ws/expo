namespace WSOFT.Expo.WebUI.Services
{
    public class EditorStateService
    {
        public event Action<string>? OnNewScript;
        public event Action<string>? OnLoadScript;
        public event Func<Task<string>>? OnGetCurrentScript;

        public void TriggerNewScript(string content)
        {
            OnNewScript?.Invoke(content);
        }

        public void TriggerLoadScript(string content)
        {
            OnLoadScript?.Invoke(content);
        }

        public async Task<string> GetCurrentScript()
        {
            if (OnGetCurrentScript != null)
            {
                return await OnGetCurrentScript.Invoke();
            }
            return "";
        }
    }
}
