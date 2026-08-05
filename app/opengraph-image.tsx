import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "96px",
          background: "#141414",
          backgroundImage:
            "radial-gradient(circle at 82% 22%, rgba(217,98,47,0.22), transparent 42%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 15,
              background: "#d9622f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
              <circle cx="3.6" cy="11.6" r="1.15" fill="white" />
              <circle cx="8.2" cy="8" r="1.55" fill="white" />
              <circle cx="12.6" cy="4.2" r="2.05" fill="white" />
            </svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#f2f2f2", letterSpacing: "-0.02em" }}>
            Taskly
          </div>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "#f2f2f2",
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            maxWidth: 900,
          }}
        >
          One list. Everything that matters today.
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "#9b9b9b",
            maxWidth: 760,
          }}
        >
          Capture fast, see what&apos;s actually due, close the loop.
        </div>
      </div>
    ),
    { ...size }
  );
}
