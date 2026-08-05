import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "#d9622f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="19" height="19" viewBox="0 0 16 16" fill="none">
          <circle cx="3.6" cy="11.6" r="1.15" fill="white" />
          <circle cx="8.2" cy="8" r="1.55" fill="white" />
          <circle cx="12.6" cy="4.2" r="2.05" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
