import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Corporate Technology & Digital Engineering`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #080F20 0%, #0D1935 55%, #10244E 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "5px",
                background: "#2F78FF",
              }}
            />
            <span>WIZZO SOLUTIONS</span>
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#93B4F8",
              border: "1px solid rgba(147, 180, 248, 0.3)",
              borderRadius: "999px",
              padding: "8px 20px",
            }}
          >
            wizzo.solutions
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "960px" }}>
          <div
            style={{
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {site.tagline}
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.45,
              color: "#CBD5E1",
            }}
          >
            Custom software engineering, modern web applications, and business automation.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.14)",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#94A3B8",
          }}
        >
          <span>Dhaka, Bangladesh &bull; Guangzhou, China</span>
          <span>Custom Software &bull; Web Engineering &bull; API &amp; Cloud</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
