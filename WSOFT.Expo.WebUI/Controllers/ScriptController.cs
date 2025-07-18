using Microsoft.AspNetCore.Mvc;
using WSOFT.Expo.WebUI.Services;

namespace WSOFT.Expo.WebUI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScriptController : ControllerBase
    {
        private readonly EditorStateService _editorStateService;

        public ScriptController(EditorStateService editorStateService)
        {
            _editorStateService = editorStateService;
        }

        [HttpPost("load")]
        public async Task<IActionResult> LoadScript([FromBody] LoadScriptRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Code))
                {
                    return BadRequest(new { error = "コードが空です" });
                }

                // エディタにコードを設定
                _editorStateService.LoadScript(request.Code);

                return Ok(new { success = true, message = "コードが正常にロードされました" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"コードのロードに失敗しました: {ex.Message}" });
            }
        }
    }

    public class LoadScriptRequest
    {
        public string Code { get; set; } = string.Empty;
        public string? Filename { get; set; }
    }
}
