import { GrootLogo } from "./GrootLogo";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export function LogoShowcase() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Floating back button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-4 h-4 text-white/60" />
      </Link>

      {/* Hero section - massive logo */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2D6A4F] rounded-full blur-[200px] opacity-15" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#52B788] rounded-full blur-[180px] opacity-10" />

        <div className="relative z-10 flex flex-col items-center gap-10">
          <p
            className="text-[0.7rem] tracking-[0.35em] text-white/30"
            style={{ fontWeight: 500 }}
          >
            BRAND IDENTITY
          </p>

          <GrootLogo size="3xl" variant="icon" />

          <GrootLogo size="3xl" variant="text" theme="light" />

          <p
            className="text-white/25 text-[0.85rem] text-center max-w-xs"
            style={{ lineHeight: 1.8 }}
          >
            그루(나무 단위) + Root.<br />
            뿌리부터 시작하는 탄소 관리 플랫폼.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </section>

      {/* Lockup section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[0.65rem] tracking-[0.3em] text-white/20 mb-16"
            style={{ fontWeight: 500 }}
          >
            01 — LOCKUP
          </p>

          <div className="flex justify-center mb-20">
            <GrootLogo size="2xl" variant="full" theme="light" />
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </section>

      {/* Symbol scale */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[0.65rem] tracking-[0.3em] text-white/20 mb-16"
            style={{ fontWeight: 500 }}
          >
            02 — SYMBOL SCALE
          </p>

          <div className="flex items-end justify-center gap-10 md:gap-16">
            {(["3xl", "2xl", "xl", "lg", "md", "sm"] as const).map((sz) => {
              const pxMap = { "3xl": 120, "2xl": 80, xl: 56, lg: 44, md: 36, sm: 28 };
              return (
                <div key={sz} className="flex flex-col items-center gap-4">
                  <GrootLogo size={sz} variant="icon" />
                  <span className="text-[0.65rem] text-white/15 font-mono">
                    {pxMap[sz]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Theme variations */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[0.65rem] tracking-[0.3em] text-white/20 mb-16"
            style={{ fontWeight: 500 }}
          >
            03 — THEME VARIATIONS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* White bg */}
            <div className="rounded-3xl bg-white p-12 flex flex-col items-center justify-center gap-8 min-h-[280px] group hover:scale-[1.02] transition-transform duration-500">
              <GrootLogo size="xl" variant="full" theme="color" />
              <span className="text-[0.65rem] tracking-[0.15em] text-gray-300" style={{ fontWeight: 500 }}>
                ON LIGHT
              </span>
            </div>

            {/* Forest bg */}
            <div className="rounded-3xl bg-gradient-to-br from-[#143728] to-[#1B4332] p-12 flex flex-col items-center justify-center gap-8 min-h-[280px] group hover:scale-[1.02] transition-transform duration-500 border border-white/5">
              <GrootLogo size="xl" variant="full" theme="light" />
              <span className="text-[0.65rem] tracking-[0.15em] text-white/20" style={{ fontWeight: 500 }}>
                ON FOREST
              </span>
            </div>

            {/* Black bg */}
            <div className="rounded-3xl bg-[#0A0A0A] p-12 flex flex-col items-center justify-center gap-8 min-h-[280px] group hover:scale-[1.02] transition-transform duration-500 border border-white/5">
              <GrootLogo size="xl" variant="full" theme="light" />
              <span className="text-[0.65rem] tracking-[0.15em] text-white/20" style={{ fontWeight: 500 }}>
                ON BLACK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Color system */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[0.65rem] tracking-[0.3em] text-white/20 mb-16"
            style={{ fontWeight: 500 }}
          >
            04 — COLOR SYSTEM
          </p>

          <div className="grid grid-cols-5 gap-3">
            {[
              { color: "#143728", name: "Midnight", hex: "#143728" },
              { color: "#1B4332", name: "Deep", hex: "#1B4332" },
              { color: "#2D6A4F", name: "Forest", hex: "#2D6A4F" },
              { color: "#40916C", name: "Canopy", hex: "#40916C" },
              { color: "#52B788", name: "Leaf", hex: "#52B788" },
            ].map((c) => (
              <div key={c.hex} className="group">
                <div
                  className="aspect-[3/4] rounded-2xl mb-4 group-hover:scale-[1.03] transition-transform duration-500"
                  style={{ backgroundColor: c.color }}
                />
                <p className="text-[0.75rem] text-white/50" style={{ fontWeight: 600 }}>
                  {c.name}
                </p>
                <p className="text-[0.65rem] text-white/15 font-mono mt-1">{c.hex}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-5 gap-3">
            {[
              { color: "#D8F3DC", name: "Mist", hex: "#D8F3DC" },
              { color: "#B7E4C7", name: "Dew", hex: "#B7E4C7" },
              { color: "#95D5B2", name: "Sage", hex: "#95D5B2" },
              { color: "#74C69D", name: "Fern", hex: "#74C69D" },
              { color: "#FFFFFF", name: "White", hex: "#FFFFFF" },
            ].map((c) => (
              <div key={c.hex} className="group">
                <div
                  className="aspect-[3/4] rounded-2xl mb-4 group-hover:scale-[1.03] transition-transform duration-500 border border-white/5"
                  style={{ backgroundColor: c.color }}
                />
                <p className="text-[0.75rem] text-white/50" style={{ fontWeight: 600 }}>
                  {c.name}
                </p>
                <p className="text-[0.65rem] text-white/15 font-mono mt-1">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage mockups */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[0.65rem] tracking-[0.3em] text-white/20 mb-16"
            style={{ fontWeight: 500 }}
          >
            05 — IN CONTEXT
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* App sidebar mock */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden hover:border-white/10 transition-colors duration-500">
              <div className="bg-gradient-to-r from-[#143728] to-[#1B4332] px-6 py-4 flex items-center">
                <GrootLogo size="sm" variant="full" theme="light" />
              </div>
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-white/5" />
                    <div
                      className="h-3 rounded-full bg-white/5"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="px-6 pb-5">
                <span className="text-[0.6rem] tracking-[0.15em] text-white/15" style={{ fontWeight: 500 }}>
                  SIDEBAR
                </span>
              </div>
            </div>

            {/* Certificate mock */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden p-10 flex flex-col items-center justify-center gap-6 hover:border-white/10 transition-colors duration-500">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#143728] to-[#2D6A4F] flex items-center justify-center">
                <GrootLogo size="lg" variant="icon" />
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-[0.95rem] text-white/70" style={{ fontWeight: 600 }}>
                  탄소 상쇄 인증서
                </p>
                <p className="text-[0.7rem] text-white/20">
                  Carbon Offset Certificate
                </p>
              </div>
              <div className="w-32 h-px bg-white/5" />
              <span className="text-[0.6rem] tracking-[0.15em] text-white/15" style={{ fontWeight: 500 }}>
                CERTIFICATE
              </span>
            </div>

            {/* Login mock */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden p-10 flex flex-col items-center justify-center gap-6 hover:border-white/10 transition-colors duration-500">
              <GrootLogo size="lg" variant="full" theme="light" />
              <div className="w-full max-w-[240px] space-y-3 mt-2">
                <div className="h-9 rounded-lg bg-white/5 border border-white/5" />
                <div className="h-9 rounded-lg bg-white/5 border border-white/5" />
                <div className="h-9 rounded-lg bg-[#2D6A4F]/40 mt-1" />
              </div>
              <span className="text-[0.6rem] tracking-[0.15em] text-white/15 mt-2" style={{ fontWeight: 500 }}>
                LOGIN
              </span>
            </div>

            {/* Favicon mock */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden p-10 flex flex-col items-center justify-center gap-8 hover:border-white/10 transition-colors duration-500">
              <div className="flex items-center gap-6">
                {[48, 32, 24, 16].map((px) => (
                  <div key={px} className="flex flex-col items-center gap-3">
                    <div style={{ width: px, height: px }}>
                      <GrootLogo size="sm" variant="icon" />
                    </div>
                    <span className="text-[0.55rem] text-white/15 font-mono">{px}px</span>
                  </div>
                ))}
              </div>
              <span className="text-[0.6rem] tracking-[0.15em] text-white/15" style={{ fontWeight: 500 }}>
                FAVICON / APP ICON
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-20 px-6 text-center">
        <p className="text-[0.6rem] tracking-[0.2em] text-white/10" style={{ fontWeight: 500 }}>
          © 2026 GROOT — ALL RIGHTS RESERVED
        </p>
      </section>
    </div>
  );
}
