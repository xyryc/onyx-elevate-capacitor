import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { exercises } from "@/data/exercises";
import { programs } from "@/data/programs";
import { recipes } from "@/data/recipes";
import { coaches } from "@/data/coaches";
import { articles } from "@/data/articles";
import { nutritionPlans } from "@/data/nutritionPlans";
import { challenges } from "@/data/challenges";

const BASE_URL = "https://onyxperformance.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  // @ts-expect-error, `server` route options exist at runtime but the type
  // augmentation from @tanstack/react-start isn't applied in this version.
  server: {
    handlers: {
      GET: async () => {
        const staticRoutes: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/exercises", changefreq: "weekly", priority: "0.9" },
          { path: "/programs", changefreq: "weekly", priority: "0.9" },
          { path: "/recipes", changefreq: "weekly", priority: "0.8" },
          { path: "/meal-plans", changefreq: "weekly", priority: "0.8" },
          { path: "/coaches", changefreq: "monthly", priority: "0.7" },
          { path: "/challenges", changefreq: "weekly", priority: "0.7" },
          { path: "/app", changefreq: "monthly", priority: "0.6" },
          { path: "/quiz", changefreq: "monthly", priority: "0.6" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/faq", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.4" },
          { path: "/careers", changefreq: "monthly", priority: "0.3" },
          { path: "/privacy", changefreq: "yearly", priority: "0.2" },
          { path: "/terms", changefreq: "yearly", priority: "0.2" },
          { path: "/refund", changefreq: "yearly", priority: "0.2" },
        ];

        const dynamic: SitemapEntry[] = [
          ...exercises.map((e) => ({
            path: `/exercises/${e.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...programs.map((p) => ({
            path: `/programs/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...recipes.map((r) => ({
            path: `/recipes/${r.slug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...coaches.map((c) => ({
            path: `/coaches/${c.slug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...articles.map((a) => ({
            path: `/articles/${a.slug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...nutritionPlans.map((n) => ({
            path: `/meal-plans/${n.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...challenges.map((c) => ({
            path: `/challenges/${c.slug}`,
            changefreq: "monthly" as const,
            priority: "0.4",
          })),
        ];

        const entries = [...staticRoutes, ...dynamic];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
