import React from "react";

interface AppLogoIconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  withBackground?: boolean;
}

export const AppLogoIcon: React.FC<AppLogoIconProps> = ({
  size = 22,
  className,
  style,
  withBackground = false,
}) => {
  if (withBackground) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className={className}
        style={{ width: size, height: size, display: "block", ...style }}
        aria-label="1boost Icon"
      >
        {/* MD3 Rounded Square Container Background (No Outline) */}
        <rect width="512" height="512" rx="112" fill="#1E1E1E" />
        <g transform="translate(96, 96) scale(2.666)">
          <path d="M 5 75 L 25 55 L 25 75 L 5 95 Z" fill="#EB5D3D" opacity="0.4" />
          <path d="M 32 60 L 72 20 L 72 50 L 32 90 Z" fill="#EB5D3D" />
          <path d="M 79 20 L 109 20 L 109 100 L 79 100 Z" fill="#E3E3E3" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={className}
      style={{ width: size, height: size, display: "block", ...style }}
      aria-label="1boost Icon"
    >
      {/* Secondary Speedline */}
      <path d="M 5 75 L 25 55 L 25 75 L 5 95 Z" fill="#EB5D3D" opacity="0.4" />
      {/* Main Upward Arrow */}
      <path d="M 32 60 L 72 20 L 72 50 L 32 90 Z" fill="#EB5D3D" />
      {/* Primary Stem */}
      <path d="M 79 20 L 109 20 L 109 100 L 79 100 Z" fill="#E3E3E3" />
    </svg>
  );
};
