import { ImageResponse } from "next/og";

export const alt = "Amer Abbadi | Engineer & Founder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0908",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* ember bloom, top right */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -180,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(255,77,0,0.30) 0%, rgba(255,77,0,0.10) 45%, rgba(255,77,0,0) 70%)",
          }}
        />

        {/* top rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            color: "#9a958f",
          }}
        >
          <span style={{ color: "#e8e6e1" }}>AMER ABBADI</span>
          <span style={{ color: "#ff4d00" }}>{"// ENGINEER · FOUNDER"}</span>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            lineHeight: 1.02,
            letterSpacing: -4,
            color: "#e8e6e1",
            fontWeight: 500,
          }}
        >
          <span>Building trust</span>
          <span>for machines</span>
          <span style={{ display: "flex", gap: 24 }}>
            <span>that</span>
            <span style={{ color: "#ff4d00" }}>think.</span>
          </span>
        </div>

        {/* bottom rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(232,230,225,0.14)",
            paddingTop: 26,
            fontSize: 22,
            letterSpacing: 3,
            color: "#767068",
          }}
        >
          <span>EXCEL IN EVERY HUMAN DOMAIN</span>
          <span>amerabbadi.com</span>
        </div>
      </div>
    ),
    size
  );
}
