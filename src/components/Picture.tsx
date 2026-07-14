import type { ImgHTMLAttributes } from "react";

export type PictureSources = {
  avif?: string;
  webp?: string;
  img: { src: string; w?: number; h?: number };
};

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  sources: PictureSources;
  /** Mark the LCP image, disables lazy loading and hints high priority. */
  priority?: boolean;
};

/**
 * Renders a <picture> with AVIF + WebP sources and a JPEG fallback.
 * Pair with `vite-imagetools` imports, e.g.
 *   import hero from "@/assets/hero.jpg?w=1600&format=avif;webp;jpg&as=picture";
 *   <Picture sources={hero} alt="Hero" priority />
 */
export function Picture({ sources, priority, className, alt = "", ...rest }: Props) {
  return (
    <picture>
      {sources.avif && <source type="image/avif" srcSet={sources.avif} />}
      {sources.webp && <source type="image/webp" srcSet={sources.webp} />}
      <img
        src={sources.img.src}
        width={sources.img.w}
        height={sources.img.h}
        loading={priority ? "eager" : "lazy"}
        // @ts-expect-error - valid HTML attribute, not yet in React types
        fetchpriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        alt={alt}
        className={className}
        {...rest}
      />
    </picture>
  );
}
