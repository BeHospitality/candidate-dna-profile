import { forwardRef } from "react";

interface DNACardProps {
  archetypeEmoji: string;
  archetypeName: string;
  archetypeTagline: string;
  signatureName: string;
  userName?: string;
  sectorBackground?: string;
  yearsExperience?: number;
  topDimensions: Array<{ label: string; score: number }>;
  bestSector: string;
  bestGeography: string;
  topDepartment: string;
  format: "linkedin" | "instagram";
}

const DNACard = forwardRef<HTMLDivElement, DNACardProps>(
  (
    {
      archetypeEmoji,
      archetypeName,
      archetypeTagline,
      signatureName,
      userName,
      sectorBackground,
      yearsExperience,
      topDimensions,
      bestSector,
      bestGeography,
      topDepartment,
      format,
    },
    ref
  ) => {
    const isLinkedIn = format === "linkedin";
    const w = isLinkedIn ? 600 : 540;
    const h = isLinkedIn ? 315 : 540;

    const containerStyle: React.CSSProperties = {
      width: w,
      height: h,
      background: "linear-gradient(135deg, #0f1729 0%, #1a2332 100%)",
      border: "1px solid rgba(245, 158, 11, 0.35)",
      borderRadius: 12,
      padding: 24,
      fontFamily: "Inter, sans-serif",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
    };

    const textureStyle: React.CSSProperties = {
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.06) 0%, transparent 50%)",
      pointerEvents: "none",
    };

    const userInfo = userName
      ? `${userName}${sectorBackground ? ` · ${sectorBackground}` : ""}${yearsExperience ? ` · ${yearsExperience} years` : ""}`
      : "Be Connect · Hospitality DNA Profile";

    const pills = [
      { emoji: "🏨", text: bestSector },
      { emoji: "📍", text: bestGeography },
      { emoji: "🏢", text: topDepartment },
    ];

    return (
      <div ref={ref} style={containerStyle}>
        <div style={textureStyle} />

        {/* TOP ROW */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          <div>
            <span style={{ fontSize: 48, display: "block", lineHeight: 1 }}>{archetypeEmoji}</span>
            <span style={{ color: "#ffffff", fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginTop: 4, display: "block" }}>{archetypeName}</span>
            <span style={{ color: "#f59e0b", fontSize: 12, fontStyle: "italic", marginTop: 2, display: "block" }}>{archetypeTagline}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              <span style={{ color: "#ffffff" }}>BE</span>
              <span style={{ color: "#3b82f6" }}>CONNECT</span>
            </div>
            <div style={{ color: "#f59e0b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>DNA ASSESSMENT</div>
          </div>
        </div>

        {/* USER INFO */}
        <div style={{ color: "#6b7280", fontSize: 11, marginTop: 12, position: "relative", zIndex: 1 }}>{userInfo}</div>

        {/* SIGNATURE */}
        <div style={{ marginTop: 10, position: "relative", zIndex: 1 }}>
          <span style={{ color: "#f59e0b", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>SIGNATURE: </span>
          <span style={{ color: "#ffffff", fontSize: 14, fontWeight: 600 }}>{signatureName}</span>
        </div>

        {/* DIMENSION BARS */}
        <div style={{ marginTop: 12, position: "relative", zIndex: 1 }}>
          {topDimensions.slice(0, 5).map((dim) => (
            <div key={dim.label} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
              <span style={{ color: "#9ca3af", fontSize: 10, width: 90, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dim.label}</span>
              <div style={{ flex: 1, margin: "0 8px", height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: 5, borderRadius: 3, background: "linear-gradient(90deg, #f59e0b, #d97706)", width: `${dim.score}%` }} />
              </div>
              <span style={{ color: "#f59e0b", fontSize: 10, width: 24, textAlign: "right" }}>{dim.score}</span>
            </div>
          ))}
        </div>

        {/* MATCHING TAGS */}
        <div style={{ marginTop: 12, display: "flex", gap: 6, position: "relative", zIndex: 1 }}>
          {pills.map((p) => (
            <span key={p.text} style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 20,
              padding: "3px 10px",
              color: "#f59e0b",
              fontSize: 10,
            }}>
              {p.emoji} {p.text}
            </span>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 10 }}>
          be-connect-dna.lovable.app
        </div>
      </div>
    );
  }
);

DNACard.displayName = "DNACard";

export default DNACard;
