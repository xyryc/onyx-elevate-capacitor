import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Sparkles } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  metric?: string;
  userName?: string;
}

/**
 * Renders a brand-styled achievement card and lets the user download it as PNG
 * via SVG → canvas (no extra deps). Works on iOS Safari and modern Chrome.
 */
export function AchievementShareCard({ title, subtitle, metric, userName }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function downloadCard() {
    setBusy(true);
    try {
      const W = 1080;
      const H = 1080;
      const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0d"/>
      <stop offset="100%" stop-color="#16181f"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#00b3ff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#00b3ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#00b3ff" stroke-opacity="0.3" stroke-width="2" rx="24"/>
  <text x="80" y="140" fill="#00b3ff" font-family="Inter, system-ui, sans-serif" font-size="28" font-weight="800" letter-spacing="6">ONYX ELEVATE</text>
  <text x="80" y="180" fill="#9aa0a6" font-family="Inter, system-ui, sans-serif" font-size="22" letter-spacing="4">ACHIEVEMENT UNLOCKED</text>
  <text x="80" y="420" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-size="92" font-weight="900">${escape(title)}</text>
  <text x="80" y="490" fill="#cfd3d8" font-family="Inter, system-ui, sans-serif" font-size="36" font-weight="500">${escape(subtitle)}</text>
  ${metric ? `<text x="80" y="${H - 200}" fill="#00b3ff" font-family="Inter, system-ui, sans-serif" font-size="180" font-weight="900">${escape(metric)}</text>` : ""}
  <text x="80" y="${H - 80}" fill="#9aa0a6" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="600">${escape(userName || "Onyx Athlete")} · onyxperformance.app</text>
</svg>`.trim();

      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob(async (out) => {
        if (!out) return;
        const file = new File([out], `onyx-${title.toLowerCase().replace(/\s+/g, "-")}.png`, {
          type: "image/png",
        });
        // Try native share first (mobile)
        const nav: any = navigator;
        if (nav.canShare && nav.canShare({ files: [file] })) {
          try {
            await nav.share({ files: [file], title, text: `${title}, Onyx Elevate` });
            return;
          } catch {
            /* fall through to download */
          }
        }
        const dl = URL.createObjectURL(out);
        const a = document.createElement("a");
        a.href = dl;
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(dl), 1000);
      }, "image/png");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-electric/30 bg-gradient-to-br from-onyx-50 to-onyx-100"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(0,179,255,0.25),transparent_60%)]" />
        <div className="relative h-full flex flex-col p-7">
          <div className="flex items-center gap-2 text-electric text-[10px] tracking-[0.3em] font-bold">
            <Sparkles className="w-3.5 h-3.5" /> ONYX ELEVATE
          </div>
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground mt-1 font-semibold">
            ACHIEVEMENT UNLOCKED
          </div>
          <div className="mt-auto">
            <h3 className="font-display text-4xl font-black leading-tight">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            {metric && (
              <div className="mt-3 text-7xl font-display font-black text-electric leading-none">
                {metric}
              </div>
            )}
            <div className="mt-5 text-[10px] text-muted-foreground/70 font-semibold">
              {userName || "Onyx Athlete"} · onyxperformance.app
            </div>
          </div>
        </div>
      </div>
      <Button onClick={downloadCard} disabled={busy} className="w-full bg-electric text-onyx-50 hover:bg-electric-glow font-bold">
        {busy ? "Generating…" : (
          <>
            <Share2 className="w-4 h-4 mr-2" />
            Share / Download <Download className="w-4 h-4 ml-2 opacity-60" />
          </>
        )}
      </Button>
    </div>
  );
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]!));
}
