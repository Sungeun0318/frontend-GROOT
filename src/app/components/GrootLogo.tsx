import { Leaf } from "lucide-react";

interface GrootLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  variant?: "full" | "icon" | "text";
  theme?: "light" | "dark" | "color";
}

export function GrootLogo({
  size = "md",
  variant = "full",
  theme = "color",
}: GrootLogoProps) {
  const heights: Record<string, number> = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
    "2xl": 96,
    "3xl": 140,
  };

  const h = heights[size];
  const iconSize = Math.max(h * 0.5, 16);
  const fontSize = Math.max(h * 0.4, 14);

  const colorMap = {
    light: { icon: "#ffffff", text: "#ffffff" },
    dark: { icon: "#2D6A4F", text: "#1a1a1a" },
    color: { icon: "#2D6A4F", text: "#2D6A4F" },
  };

  const colors = colorMap[theme];

  if (variant === "icon") {
    return <Leaf style={{ width: iconSize, height: iconSize, color: colors.icon }} />;
  }

  if (variant === "text") {
    return (
      <span style={{ fontSize, fontWeight: 800, color: colors.text, letterSpacing: "-0.02em" }}>
        GROOT
      </span>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: h * 0.15, height: h }}>
      <Leaf style={{ width: iconSize, height: iconSize, color: colors.icon }} />
      <span style={{ fontSize, fontWeight: 800, color: colors.text, letterSpacing: "-0.02em" }}>
        GROOT
      </span>
    </div>
  );
}
