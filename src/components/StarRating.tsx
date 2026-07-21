import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = 16,
  className,
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: number;
  className?: string;
}) {
  const interactive = !!onChange;
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={cn(
            interactive && "cursor-pointer hover:scale-110 transition-transform",
            !interactive && "cursor-default",
          )}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= value ? "fill-electric text-electric" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  );
}
