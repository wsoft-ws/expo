namespace WSOFT.Expo.WebUI.Models
{
    public class CanvasShape
    {
        public string Type { get; set; } = "";
        public double X { get; set; }
        public double Y { get; set; }
        public double X2 { get; set; }
        public double Y2 { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Radius { get; set; }
        public double RadiusX { get; set; }
        public double RadiusY { get; set; }
        public double LineWidth { get; set; } = 1;
        public string Color { get; set; } = "#000000";
        public string Color2 { get; set; } = "#000000";
        public string Text { get; set; } = "";
        public string Font { get; set; } = "16px Arial";
        public double[] Points { get; set; } = Array.Empty<double>();
        public double ControlX1 { get; set; }
        public double ControlY1 { get; set; }
        public double ControlX2 { get; set; }
        public double ControlY2 { get; set; }
        public double StartAngle { get; set; }
        public double EndAngle { get; set; }
        public string GradientDirection { get; set; } = "horizontal";
        public string ImageUrl { get; set; } = "";
    }

    public class CanvasTransform
    {
        public string Type { get; set; } = "";
        public double Value1 { get; set; }
        public double Value2 { get; set; }
        public double Value3 { get; set; }
        public double Value4 { get; set; }
    }

    public class CanvasShadow
    {
        public double OffsetX { get; set; }
        public double OffsetY { get; set; }
        public double Blur { get; set; }
        public string Color { get; set; } = "";
    }
}
