import type { Invitation } from "@/types";
import Image from "next/image";
import bgImage from "../../temp/Black and Yellow Grunge Graduation Invitation.png";
import bgImagePc from "../../temp/Black and Yellow Grunge Graduation Invitation_pc.png";

/**
 * TemplateClassic
 * Graduation invitation — watercolor grey background
 * Rebuild từ template gốc theo SKILL.md
 *
 * Layout (top → bottom):
 *   [background image]
 *   [cap image — top center, built-in trong ảnh nền]
 *   GRADUATION / CEREMONY
 *   name (spaced caps)
 *   "Class of" + class (Dancing Script)
 *   divider — time — divider
 *   location
 *   message (optional)
 */

export default function GrungeSilver({
  name,
  class: cls,
  time,
  location,
  message,
}: Invitation) {
  const displayClass = cls?.trim() || "2024";
  const displayTime = time?.trim() || "01.07.2024";
  const displayLocation = location?.trim() || "HNUE, Ha Noi";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src={bgImage}
        alt=""
        fill
        className="md:hidden"
        style={{ objectFit: "cover", objectPosition: "top center" }}
        priority
      />
      <Image
        src={bgImagePc}
        alt=""
        fill
        className="hidden md:block"
        style={{ objectFit: "cover", objectPosition: "top center" }}
        priority
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
            fontFamily: "'Cormorant Garamond', serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "180px",
              paddingBottom: "48px",
              paddingLeft: "28px",
              paddingRight: "28px",
              boxSizing: "border-box",
            }}
          >
        {/* GRADUATION CEREMONY */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(34px, 6vw, 78px)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#111",
            textTransform: "uppercase",
            lineHeight: 1.1,
            margin: "0 0 4px",
          }}
        >
          Graduation
        </h1>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(24px, 4.2vw, 58px)",
            fontWeight: 400,
            letterSpacing: "0.2em",
            color: "#222",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Ceremony
        </p>

        {/* NAME — spaced small caps */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(13px, 1.9vw, 42px)",
            fontWeight: 400,
            letterSpacing: "0.25em",
            color: "#333",
            textTransform: "uppercase",
            margin: "0 0 4px",
          }}
        >
          {name}
        </p>

        {/* Class of [class] — Dancing Script */}
        <p
            style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "clamp(18px, 10vw, 40px)",
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.0,
                margin: "8px 0 8px 0",
            }}
            >
            Class 
            </p>
            <p
            style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "clamp(14px, 9.2vw, 36px)",
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.0,
                margin: "0 0 8px",
            }}
            >
            {displayClass.split(' ')[0]}
            </p>
            {displayClass.split(' ').slice(1).join(' ') && (
            <p
                style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(12px, 2.5vw, 20px)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#444",
                lineHeight: 1.4,
                margin: "0 0 24px",
                }}
            >
                {displayClass.split(' ').slice(1).join(' ')}
            </p>
            )}

        {/* ── Divider + Time + Divider ── */}
        <div
          style={{
            width: "160px",
            borderTop: "1px solid #999",
            margin: "0 auto 12px",
          }}
        />
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(20px, 3.6vw, 46px)",
            fontWeight: 600,
            letterSpacing: "0.18em",
            color: "#111",
            margin: "0 0 12px",
          }}
        >
          {displayTime}
        </p>
        <div
          style={{
            width: "160px",
            borderTop: "1px solid #999",
            margin: "0 auto 18px",
          }}
        />

        {/* Location */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(18px, 3vw, 34px)",
            letterSpacing: "0.06em",
            color: "#444",
            margin: "0 0 12px",
            lineHeight: 1.5,
          }}
        >
          {displayLocation}
        </p>

        {/* Message (optional) */}
        {message && (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(16px, 2.8vw, 30px)",
              fontStyle: "italic",
              color: "#666",
              lineHeight: 1.7,
              margin: "0",
              maxWidth: "680px",
            }}
          >
            {message}
          </p>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}