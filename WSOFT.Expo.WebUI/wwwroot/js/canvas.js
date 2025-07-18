// キャンバス描画機能
window.drawShapes = (canvas, shapes, transforms, shadow) => {
  const ctx = canvas.getContext("2d");

  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景を白に設定
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 座標変換を保存
  ctx.save();

  // 変換を適用
  if (transforms && transforms.length > 0) {
    transforms.forEach((transform) => {
      switch (transform.type) {
        case "translate":
          ctx.translate(transform.value1, transform.value2);
          break;
        case "rotate":
          ctx.rotate(transform.value1);
          break;
        case "scale":
          ctx.scale(transform.value1, transform.value2);
          break;
      }
    });
  }

  // 影の設定
  if (shadow) {
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowColor = shadow.color;
  }

  // 各図形を描画
  shapes.forEach((shape) => {
    ctx.strokeStyle = shape.color || "#000000";
    ctx.fillStyle = shape.color || "#000000";
    ctx.lineWidth = shape.lineWidth || 1;

    switch (shape.type) {
      case "rect":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case "filledRect":
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case "gradientRect":
        const gradient =
          shape.gradientDirection === "vertical"
            ? ctx.createLinearGradient(
                shape.x,
                shape.y,
                shape.x,
                shape.y + shape.height
              )
            : ctx.createLinearGradient(
                shape.x,
                shape.y,
                shape.x + shape.width,
                shape.y
              );
        gradient.addColorStop(0, shape.color);
        gradient.addColorStop(1, shape.color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case "filledCircle":
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case "ellipse":
        ctx.beginPath();
        ctx.ellipse(
          shape.x,
          shape.y,
          shape.radiusX,
          shape.radiusY,
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        break;

      case "filledEllipse":
        ctx.beginPath();
        ctx.ellipse(
          shape.x,
          shape.y,
          shape.radiusX,
          shape.radiusY,
          0,
          0,
          2 * Math.PI
        );
        ctx.fill();
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
        break;

      case "polygon":
        if (shape.points && shape.points.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0], shape.points[1]);
          for (let i = 2; i < shape.points.length; i += 2) {
            ctx.lineTo(shape.points[i], shape.points[i + 1]);
          }
          ctx.closePath();
          ctx.stroke();
        }
        break;

      case "filledPolygon":
        if (shape.points && shape.points.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0], shape.points[1]);
          for (let i = 2; i < shape.points.length; i += 2) {
            ctx.lineTo(shape.points[i], shape.points[i + 1]);
          }
          ctx.closePath();
          ctx.fill();
        }
        break;

      case "bezier":
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y);
        ctx.bezierCurveTo(
          shape.controlX1,
          shape.controlY1,
          shape.controlX2,
          shape.controlY2,
          shape.x2,
          shape.y2
        );
        ctx.stroke();
        break;

      case "arc":
        ctx.beginPath();
        ctx.arc(
          shape.x,
          shape.y,
          shape.radius,
          shape.startAngle,
          shape.endAngle
        );
        ctx.stroke();
        break;

      case "text":
        ctx.font = shape.font || "16px Arial";
        ctx.fillText(shape.text, shape.x, shape.y);
        break;

      case "image":
        if (shape.imageUrl) {
          const img = new Image();
          img.onload = () => {
            if (shape.width > 0 && shape.height > 0) {
              ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height);
            } else {
              ctx.drawImage(img, shape.x, shape.y);
            }
          };
          img.src = shape.imageUrl;
        }
        break;
    }
  });

  // 座標変換を復元
  ctx.restore();
};
