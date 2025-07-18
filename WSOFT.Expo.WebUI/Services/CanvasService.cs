using WSOFT.Expo.WebUI.Models;

namespace WSOFT.Expo.WebUI.Services
{
    /// <summary>
    /// AliceScriptからキャンバス描画機能にアクセスするためのラッパークラス
    /// </summary>
    public class Canvas
    {
        private static CanvasService? _canvasService;

        public static void SetCanvasService(CanvasService service)
        {
            _canvasService = service;
        }

        /// <summary>
        /// 矩形を描画します
        /// </summary>
        public static void DrawRect(double x, double y, double width, double height, string color = "#000000", bool filled = false)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = filled ? "filledRect" : "rect",
                X = x,
                Y = y,
                Width = width,
                Height = height,
                Color = color
            });
        }

        /// <summary>
        /// 円を描画します
        /// </summary>
        public static void DrawCircle(double x, double y, double radius, string color = "#000000", bool filled = false)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = filled ? "filledCircle" : "circle",
                X = x,
                Y = y,
                Radius = radius,
                Color = color
            });
        }

        /// <summary>
        /// 線を描画します
        /// </summary>
        public static void DrawLine(double x1, double y1, double x2, double y2, string color = "#000000", double lineWidth = 1)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = "line",
                X = x1,
                Y = y1,
                X2 = x2,
                Y2 = y2,
                Color = color,
                LineWidth = lineWidth
            });
        }

        /// <summary>
        /// テキストを描画します
        /// </summary>
        public static void DrawText(string text, double x, double y, string color = "#000000", string font = "16px Arial")
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = "text",
                X = x,
                Y = y,
                Text = text,
                Color = color,
                Font = font
            });
        }

        /// <summary>
        /// キャンバスをクリアします
        /// </summary>
        public static void Clear()
        {
            _canvasService?.Clear();
        }

        /// <summary>
        /// キャンバスのサイズを設定します
        /// </summary>
        public static void SetSize(double width, double height)
        {
            _canvasService?.SetSize(width, height);
        }

        /// <summary>
        /// 楕円を描画します
        /// </summary>
        public static void DrawEllipse(double x, double y, double radiusX, double radiusY, string color = "#000000", bool filled = false)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = filled ? "filledEllipse" : "ellipse",
                X = x,
                Y = y,
                RadiusX = radiusX,
                RadiusY = radiusY,
                Color = color
            });
        }

        /// <summary>
        /// 多角形を描画します
        /// </summary>
        public static void DrawPolygon(double[] points, string color = "#000000", bool filled = false)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = filled ? "filledPolygon" : "polygon",
                Points = points,
                Color = color
            });
        }

        /// <summary>
        /// ベジェ曲線を描画します
        /// </summary>
        public static void DrawBezier(double x1, double y1, double cp1x, double cp1y, double cp2x, double cp2y, double x2, double y2, string color = "#000000", double lineWidth = 1)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = "bezier",
                X = x1,
                Y = y1,
                X2 = x2,
                Y2 = y2,
                ControlX1 = cp1x,
                ControlY1 = cp1y,
                ControlX2 = cp2x,
                ControlY2 = cp2y,
                Color = color,
                LineWidth = lineWidth
            });
        }

        /// <summary>
        /// 弧を描画します
        /// </summary>
        public static void DrawArc(double x, double y, double radius, double startAngle, double endAngle, string color = "#000000", double lineWidth = 1)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = "arc",
                X = x,
                Y = y,
                Radius = radius,
                StartAngle = startAngle,
                EndAngle = endAngle,
                Color = color,
                LineWidth = lineWidth
            });
        }

        /// <summary>
        /// グラデーション矩形を描画します
        /// </summary>
        public static void DrawGradientRect(double x, double y, double width, double height, string color1, string color2, string direction = "horizontal")
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = "gradientRect",
                X = x,
                Y = y,
                Width = width,
                Height = height,
                Color = color1,
                Color2 = color2,
                GradientDirection = direction
            });
        }

        /// <summary>
        /// 影付きで図形を描画
        /// </summary>
        public static void SetShadow(double offsetX, double offsetY, double blur, string color)
        {
            _canvasService?.SetShadow(offsetX, offsetY, blur, color);
        }

        /// <summary>
        /// 影をクリア
        /// </summary>
        public static void ClearShadow()
        {
            _canvasService?.ClearShadow();
        }

        /// <summary>
        /// 座標系を回転
        /// </summary>
        public static void Rotate(double angle)
        {
            _canvasService?.AddTransform("rotate", angle, 0, 0, 0);
        }

        /// <summary>
        /// 座標系を平行移動
        /// </summary>
        public static void Translate(double x, double y)
        {
            _canvasService?.AddTransform("translate", x, y, 0, 0);
        }

        /// <summary>
        /// 座標系をスケール
        /// </summary>
        public static void Scale(double x, double y)
        {
            _canvasService?.AddTransform("scale", x, y, 0, 0);
        }

        /// <summary>
        /// 座標系をリセット
        /// </summary>
        public static void ResetTransform()
        {
            _canvasService?.ResetTransform();
        }

        /// <summary>
        /// 画像を描画（将来の拡張用）
        /// </summary>
        public static void DrawImage(string imageUrl, double x, double y, double width = 0, double height = 0)
        {
            _canvasService?.AddShape(new CanvasShape
            {
                Type = "image",
                X = x,
                Y = y,
                Width = width,
                Height = height,
                ImageUrl = imageUrl
            });
        }
    }

    public class CanvasService
    {
        private readonly List<CanvasShape> _shapes = new();
        private readonly List<CanvasTransform> _transforms = new();
        private CanvasShadow? _currentShadow;

        public double Width { get; private set; } = 600;
        public double Height { get; private set; } = 400;

        public event Action? OnShapesChanged;
        public IReadOnlyList<CanvasShape> Shapes => _shapes.AsReadOnly();
        public IReadOnlyList<CanvasTransform> Transforms => _transforms.AsReadOnly();
        public CanvasShadow? CurrentShadow => _currentShadow;

        public void AddShape(CanvasShape shape)
        {
            _shapes.Add(shape);
            OnShapesChanged?.Invoke();
        }

        public void Clear()
        {
            _shapes.Clear();
            OnShapesChanged?.Invoke();
        }

        public void SetSize(double width, double height)
        {
            Width = width;
            Height = height;
            OnShapesChanged?.Invoke();
        }

        public void SetShadow(double offsetX, double offsetY, double blur, string color)
        {
            _currentShadow = new CanvasShadow
            {
                OffsetX = offsetX,
                OffsetY = offsetY,
                Blur = blur,
                Color = color
            };
            OnShapesChanged?.Invoke();
        }

        public void ClearShadow()
        {
            _currentShadow = null;
            OnShapesChanged?.Invoke();
        }

        public void AddTransform(string type, double value1, double value2, double value3, double value4)
        {
            _transforms.Add(new CanvasTransform
            {
                Type = type,
                Value1 = value1,
                Value2 = value2,
                Value3 = value3,
                Value4 = value4
            });
            OnShapesChanged?.Invoke();
        }

        public void ResetTransform()
        {
            _transforms.Clear();
            OnShapesChanged?.Invoke();
        }
    }
}
