import { useEffect, useRef, useState } from "react";
import logoImg from "@/assets/groot-logo.png";

interface GrootLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  variant?: "full" | "icon" | "text";
  theme?: "light" | "dark" | "color";
}

// 흰색 배경을 투명하게 제거하는 함수
function removeWhiteBackground(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  invert: boolean
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 흰색 또는 거의 흰색인 픽셀을 투명하게 처리
    const brightness = (r + g + b) / 3;
    if (brightness > 240 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
      data[i + 3] = 0; // alpha = 0 (투명)
    } else if (brightness > 220 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15) {
      // 약간 회색빛인 경우 반투명 처리 (부드러운 경계)
      data[i + 3] = Math.round((255 - brightness) * 3);
    }
  }

  // 색상 반전 (light 테마: 흰색으로 표시)
  if (invert) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = 255;     // R
        data[i + 1] = 255; // G
        data[i + 2] = 255; // B
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function GrootLogo({
  size = "md",
  variant = "full",
  theme = "color",
}: GrootLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const heights: Record<string, number> = {
    sm: 48,
    md: 64,
    lg: 84,
    xl: 110,
    "2xl": 160,
    "3xl": 240,
  };

  const h = heights[size];

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (canvasRef.current) {
        removeWhiteBackground(img, canvasRef.current, theme === "light");
        setReady(true);
      }
    };
    img.src = logoImg;
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        height: h,
        width: "auto",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.15s ease",
        ...(theme === "dark" ? { filter: "brightness(0)" } : {}),
      }}
    />
  );
}
