namespace WSOFT.Expo.WebUI.Models
{
    public class ConsoleMessage
    {
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public MessageType Type { get; set; } = MessageType.Info;
    }

    public enum MessageType
    {
        Debug,
        Info,
        Success,
        Warning,
        Error
    }
}
