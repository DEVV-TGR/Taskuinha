import { ImageResponse } from "next/og";
import { site, fullAddress } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.fullName}, taberna à beira-mar em Vila Chã`;

/*
  O `next/font` não chega ao ImageResponse (corre fora do React normal, num
  renderizador próprio — o Satori). Para ter a Rye no cartão de partilha era
  preciso ir buscar o ficheiro à Google Fonts, mas a API só devolve WOFF2
  pelo `User-Agent` que se lhe dá, e o Satori só lê TTF/OTF — a rota
  rebentava com "Input buffer contains unsupported image format". Verificado
  em execução, não hipotético. O plano já previa esta saída: "se complicar,
  usar uma serif do sistema e aceitar a diferença" — é um cartão de
  partilha, não a página.
*/
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
          background: "#080B0D",
          color: "#E8DCC4",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* A bandeira negra da casa, simplificada — o mesmo desenho do
              app/icon.svg, maior. */}
          <svg width="96" height="96" viewBox="0 0 32 32">
            <path
              d="M16 5c-4.8 0-8 3.4-8 7.8 0 2.9 1.5 5 3 6.4v3.3c0 .8.6 1.5 1.4 1.5h.8v-2h1.3v2h3v-2h1.3v2h.8c.8 0 1.4-.7 1.4-1.5v-3.3c1.5-1.4 3-3.5 3-6.4 0-4.4-3.2-7.8-8-7.8z"
              fill="#E8DCC4"
            />
            <circle cx="12.6" cy="13.6" r="2.3" fill="#080B0D" />
            <circle cx="19.4" cy="13.6" r="2.3" fill="#080B0D" />
          </svg>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 128,
                fontFamily: "Georgia, serif",
                fontWeight: 700,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              TASKUI
              <span style={{ display: "flex", transform: "scaleX(-1)" }}>N</span>
              HA
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 26,
                letterSpacing: 14,
                textTransform: "uppercase",
                color: "#F2A33C",
              }}
            >
              do Pirata
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 38, color: "#E8DCC4" }}>
            O mar fica a vinte passos.
          </div>
          <div style={{ fontSize: 26, color: "#9A8F7C" }}>{fullAddress()}</div>
        </div>
      </div>
    ),
    size,
  );
}
