import { ImageResponse } from "next/og";
import { site, fullAddress } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.fullName}, taberna à beira-mar em Vila Chã`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1214",
          color: "#f2ede4",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -4,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Taskuinha
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 26,
              letterSpacing: 14,
              textTransform: "uppercase",
              color: "#e2622a",
            }}
          >
            do Pirata
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 40, color: "#f2ede4" }}>
            O mar fica a vinte passos.
          </div>
          <div style={{ fontSize: 26, color: "#9aa8aa" }}>{fullAddress()}</div>
        </div>
      </div>
    ),
    size,
  );
}
