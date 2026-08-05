import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 38,
          background: "#d9622f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="104" height="104" viewBox="0 0 16 16" fill="none">
          <circle cx="3.6" cy="11.6" r="1.15" fill="white" />
          <circle cx="8.2" cy="8" r="1.55" fill="white" />
          <circle cx="12.6" cy="4.2" r="2.05" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
