import { cloneElement, isValidElement, useEffect, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import type { Program } from "@/data/programs";
import { useT } from "@/i18n/LanguageProvider";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { TrainingBody } from "@/routes/_authenticated/training.$slug";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function TrainingDialog({ program, children }: { program: Program; children: ReactNode }) {
  const t = useT();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [checked, setChecked] = useState(false);

  // Check once whether this program is already in the user's library.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        if (!cancelled) {
          setAdded(false);
          setChecked(true);
        }
        return;
      }
      const { data } = await supabase
        .from("favorites")
        .select("item_slug")
        .eq("item_type", "program")
        .eq("item_slug", program.slug)
        .maybeSingle();
      if (!cancelled) {
        setAdded(!!data);
        setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, program.slug]);

  // Hide the mobile bottom tab bar while this fullscreen dialog is open.
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    document.body.classList.add("hide-bottom-tabbar");
    return () => {
      document.body.classList.remove("hide-bottom-tabbar");
    };
  }, [open]);

  const handleOpenChange = async (v: boolean) => {
    setOpen(v);
    if (v && user && !added) {
      try {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, item_type: "program", item_slug: program.slug });
        if (!error) {
          setAdded(true);
          toast.success(t("program.addedToWorkout") || "Lagt til i treningen din");
        }
      } catch {
        /* ignore duplicate */
      }
    }
  };

  type TriggerElement = ReactElement<{
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    "aria-haspopup"?: "dialog";
    "aria-expanded"?: boolean;
    "data-added"?: boolean;
    children?: ReactNode;
    className?: string;
  }>;
  const original = isValidElement(children) ? (children as TriggerElement) : null;
  const trigger = original
    ? cloneElement(original, {
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "data-added": added,
        children: checked && added ? (
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-4 w-4" strokeWidth={3} />
            {t("program.alreadyInWorkout") || "Lagt til"}
          </span>
        ) : original.props.children,
        onClick: (e: MouseEvent<HTMLElement>) => {
          original.props.onClick?.(e);
          if (!e.defaultPrevented) handleOpenChange(true);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          const shouldOpen = e.key === "Enter" || e.key === " ";
          original.props.onKeyDown?.(e);
          if (shouldOpen) {
            e.preventDefault();
            handleOpenChange(true);
          }
        },
      })
    : children;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-background border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <VisuallyHidden>
          <DialogTitle>{program.title}</DialogTitle>
          <DialogDescription>{program.tagline}</DialogDescription>
        </VisuallyHidden>
        <DialogClose className="fixed sm:absolute right-3 top-[max(env(safe-area-inset-top),0.75rem)] sm:top-3 z-[60] grid h-10 w-10 place-items-center rounded-full bg-onyx-950/80 text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-onyx-950/95 transition-colors focus:outline-none focus:ring-2 focus:ring-electric shadow-lg">
          <X className="h-5 w-5" />
          <span className="sr-only">{t("common.close")}</span>
        </DialogClose>
        <TrainingBody program={program} variant="dialog" />
      </DialogContent>
    </Dialog>
  );
}
