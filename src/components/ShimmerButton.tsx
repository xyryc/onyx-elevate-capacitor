import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ShimmerButton({ children, className, ...props }: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-sm font-bold text-onyx-50 transition-all shadow-[0_0_0_1px_oklch(0.6_0.2_160/0.4),0_0_30px_-5px_oklch(0.65_0.18_165/0.55),0_15px_40px_-15px_oklch(0.55_0.18_165/0.5)] hover:shadow-[0_0_0_1px_oklch(0.65_0.22_160/0.55),0_0_45px_-5px_oklch(0.7_0.2_165/0.65),0_20px_50px_-15px_oklch(0.55_0.18_165/0.6)] hover:scale-[1.02] active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <Crown className="h-4 w-4 fill-onyx-50 text-onyx-50" />
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(110deg, transparent 20%, color-mix(in oklab, oklch(1 0 0) 75%, transparent) 40%, color-mix(in oklab, oklch(0.95 0.05 160) 65%, transparent) 50%, color-mix(in oklab, oklch(1 0 0) 75%, transparent) 60%, transparent 80%)",
          transform: "translateX(-100%)",
          animation: "shimmer-sweep 2s ease-in-out infinite",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, color-mix(in oklab, oklch(1 0 0) 45%, transparent) 50%, transparent 70%)",
          transform: "translateX(-100%)",
          animation: "shimmer-sweep 2s ease-in-out infinite",
          animationDelay: "0.15s",
        }}
      />
    </button>
  );
}
