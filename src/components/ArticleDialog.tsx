import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Article } from "@/data/articles";
import { ArticleDetailView } from "./ArticleDetailView";

export function ArticleDialog({
  article,
  children,
}: {
  article: Article;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-5xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <VisuallyHidden>
          <DialogTitle>{article.title}</DialogTitle>
          <DialogDescription>{article.excerpt}</DialogDescription>
        </VisuallyHidden>
        <div className="sticky top-0 right-0 z-50 h-0 pointer-events-none">
          <DialogClose className="absolute right-3 top-3 pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <ArticleDetailView article={article} />
      </DialogContent>
    </Dialog>
  );
}
