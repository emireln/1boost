import React from "react";

interface LogoBannerProps {
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const LogoBanner: React.FC<LogoBannerProps> = ({
  height = 22,
  className,
  style,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 550 160"
      className={className}
      style={{ height, width: "auto", display: "block", ...style }}
      aria-label="1boost"
    >
      <text
        x="50%"
        y="52%"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontSize="160"
        fontWeight="900"
        textAnchor="middle"
        dominantBaseline="central"
        letterSpacing="-5"
      >
        <tspan fill="#EB5D3D">1</tspan>
        <tspan fill="#E3E3E3">boost</tspan>
      </text>
    </svg>
  );
};
