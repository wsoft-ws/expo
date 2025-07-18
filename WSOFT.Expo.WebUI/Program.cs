using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using WSOFT.Expo.WebUI;
using WSOFT.Expo.WebUI.Services;
using AliceScript;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddSingleton<ScriptService>();
builder.Services.AddSingleton<EditorStateService>();
builder.Services.AddSingleton<CanvasService>();

var app = builder.Build();

// AliceScriptにCanvas関数を登録
var canvasService = app.Services.GetService<CanvasService>();
if (canvasService != null)
{
    Canvas.SetCanvasService(canvasService);
}
Alice.RegisterFunctions<Canvas>();

await app.RunAsync();
