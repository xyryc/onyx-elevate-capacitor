import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Coach } from "@/data/coaches";
import { coaches } from "@/data/coaches";
import { useLang } from "@/i18n/LanguageProvider";
import trymBeforeAsset from "@/assets/trym-before.png.asset.json";
import trymAfterAsset from "@/assets/trym-after.png.asset.json";

/**
 * Full coach detail body, shared by the /coaches/$slug route and CoachDialog.
 * Structure/content is identical to the standalone page (minus the back button,
 * which the dialog replaces with a sticky X).
 */
export function CoachDetailView({ coach, showBackLink = false, showOtherCoaches = true }: { coach: Coach; showBackLink?: boolean; showOtherCoaches?: boolean }) {
  const { lang } = useLang();
  const images = coach.gallery && coach.gallery.length > 0 ? coach.gallery : [coach.img];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <article>
      <section className="relative border-b border-border/60 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="container-onyx relative py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {showBackLink && (
                <Link to="/coaches" className="text-xs uppercase tracking-[0.2em] text-electric font-semibold hover:opacity-80">← Back</Link>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-electric">
                {coach.tag}{coach.competes && " · Competitor"}
              </span>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl surface-card max-w-md">
              {images.map((src, i) => (
                <img key={src} src={src} alt={coach.name} width={800} height={1024}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                  style={{ opacity: i === idx ? 1 : 0 }}
                  decoding="async" loading={i === 0 ? "eager" : "lazy"} />
              ))}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 w-6 rounded-full transition-all ${i === idx ? "bg-electric" : "bg-white/30"}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.05]">{coach.name}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{coach.role}</p>
            <p className="mt-6 text-base leading-relaxed text-foreground/85 max-w-xl">{coach.bio}</p>
            {coach.slug === 'thiago-deschamps' && (
              <div className="mt-6 max-w-lg">
                <div className="surface-card rounded-xl overflow-hidden aspect-video">
                  <iframe
                    src="https://iframe.mediadelivery.net/embed/693143/f979140b-d31e-4415-bd01-4c8e2c536f39?autoplay=false&muted=true&preload=false"
                    title="Thiago Deschamps introduction"
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            )}
            {coach.slug === 'trym' && (
              <div className="mt-6 max-w-md">
                <div className="text-xs uppercase tracking-[0.2em] text-electric font-semibold mb-2">Transformation · 135kg → 85kg</div>
                <div className="grid grid-cols-2 gap-3">
                  <figure className="surface-card rounded-xl overflow-hidden">
                    <div className="relative aspect-[3/4] bg-onyx-200">
                      <img src={trymBeforeAsset.url} alt="Trym before, 135 kg" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                      <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-onyx-50/80 backdrop-blur border border-border font-bold">Before · 135kg</span>
                    </div>
                  </figure>
                  <figure className="surface-card rounded-xl overflow-hidden">
                    <div className="relative aspect-[3/4] bg-onyx-200">
                      <img src={trymAfterAsset.url} alt="Trym after, 85 kg" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                      <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-electric text-onyx-50 font-bold">After · 85kg</span>
                    </div>
                  </figure>
                </div>
              </div>
            )}
            {(coach.yearsTraining || coach.weightClass) && (
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
                {coach.yearsTraining && (
                  <div className="surface-card rounded-lg p-3">
                    <div className="text-2xl font-display font-bold text-gradient-electric">{coach.yearsTraining}+ yrs</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Training</div>
                  </div>
                )}
                {coach.weightClass && (
                  <div className="surface-card rounded-lg p-3">
                    <div className="text-sm font-display font-bold">{coach.weightClass}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Class</div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {coach.specialties.map((s) => (
                <span key={s} className="rounded-full border border-border bg-onyx-100 px-3 py-1 text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container-onyx py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="font-display text-2xl font-bold">Philosophy</h2>
            <blockquote className="mt-4 border-l-2 border-electric pl-5 italic text-lg text-foreground/90">
              "{coach.philosophy}"
            </blockquote>
          </section>

          {coach.achievements && coach.achievements.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold">Career & achievements</h2>
              <ul className="mt-4 space-y-2">
                {coach.achievements.map((a) => (
                  <li key={a} className="flex gap-3 surface-card rounded-lg p-4 border-electric/20">
                    <svg className="h-5 w-5 flex-none text-electric mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h14l-1 7a6 6 0 0 1-5 5.91V18h3v2H8v-2h3v-3.09A6 6 0 0 1 6 9L5 2zm2.3 2l.7 5a4 4 0 0 0 8 0l.7-5H7.3z"/></svg>
                    <span className="text-sm">{a}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {coach.longBio && coach.longBio.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold">The story</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/85">
                {coach.longBio.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-display text-2xl font-bold">Signature lifts & drills</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {coach.signatureLifts.map((l) => (
                <div key={l} className="surface-card rounded-lg p-4 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-electric" />
                  <span className="font-semibold">{l}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">{lang === "no" ? `En uke i ${coach.name} sin trening` : `A week in ${coach.name}'s training`}</h2>
            <div className="mt-4 surface-card rounded-xl overflow-hidden divide-y divide-border">
              {coach.weeklySplit.map((d) => (
                <div key={d.day} className="grid grid-cols-[80px_1fr] gap-4 p-4">
                  <div className="text-xs uppercase tracking-wider text-electric font-semibold">{d.day}</div>
                  <div className="text-sm">{d.focus}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">{lang === "no" ? `${coach.name} sine beste tips` : `${coach.name}'s top tips`}</h2>
            <ul className="mt-4 space-y-3">
              {coach.tips.map((t) => (
                <li key={t} className="flex gap-3 surface-card rounded-lg p-4">
                  <svg className="h-5 w-5 flex-none text-electric mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {coach.instagram && (
            <section>
              <h2 className="font-display text-2xl font-bold">{lang === "no" ? "Følg på Instagram" : lang === "pt-BR" ? "Siga no Instagram" : lang === "es" ? "Sigue en Instagram" : "Follow on Instagram"}</h2>
              <a
                href={coach.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-3 surface-card rounded-lg p-4 hover:border-electric/40 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(coach.instagram, "_blank", "noopener,noreferrer");
                }}
              >
                <svg className="h-6 w-6 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
                <span className="font-semibold text-sm">@{coach.instagram.replace(/\/$/, "").split("/").pop()}</span>
              </a>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="surface-card rounded-2xl p-6 border-electric/40">
            <span className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Personal Training</span>
            <h3 className="mt-2 font-display text-xl font-bold">{coach.coaching.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{coach.coaching.summary}</p>
            <div className="mt-5 text-sm font-semibold text-electric">Coming soon, join the waitlist</div>
            <ul className="mt-5 space-y-2 text-sm">
              {coach.coaching.includes.map((i) => (
                <li key={i} className="flex gap-2">
                  <svg className="h-4 w-4 flex-none text-electric mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            {(() => {
              const first = coach.name.split(" ")[0];
              const templates: Record<string, { subject: string; body: string; cta: string }> = {
                en: {
                  subject: `Coaching application, ${coach.name}`,
                  cta: "Apply for coaching",
                  body: `Hi ${first},\n\nI'd like to apply for 1-on-1 coaching.\n\nName:\nAge:\nCurrent training experience:\nGoals (next 3–6 months):\nInjuries / limitations:\nEquipment available:\nWhy you want to work with ${first}:\n\nThanks!`,
                },
                no: {
                  subject: `Coaching-søknad, ${coach.name}`,
                  cta: "Søk om coaching",
                  body: `Hei ${first},\n\nJeg vil gjerne søke om 1-til-1 coaching.\n\nNavn:\nAlder:\nNåværende treningserfaring:\nMål (neste 3–6 måneder):\nSkader / begrensninger:\nTilgjengelig utstyr:\nHvorfor du vil jobbe med ${first}:\n\nTakk!`,
                },
                "pt-BR": {
                  subject: `Candidatura de coaching, ${coach.name}`,
                  cta: "Candidatar-se ao coaching",
                  body: `Olá ${first},\n\nGostaria de me candidatar ao coaching individual.\n\nNome:\nIdade:\nExperiência atual de treino:\nObjetivos (próximos 3–6 meses):\nLesões / limitações:\nEquipamento disponível:\nPor que quer trabalhar com ${first}:\n\nObrigado!`,
                },
                es: {
                  subject: `Solicitud de coaching, ${coach.name}`,
                  cta: "Solicitar coaching",
                  body: `Hola ${first},\n\nMe gustaría solicitar coaching 1 a 1.\n\nNombre:\nEdad:\nExperiencia actual de entrenamiento:\nObjetivos (próximos 3–6 meses):\nLesiones / limitaciones:\nEquipo disponible:\nPor qué quieres trabajar con ${first}:\n\n¡Gracias!`,
                },
              };
              const tpl = templates[lang] ?? templates.en;
              return (
                <a
                  href={`mailto:OnyxPerformanceTeam@hotmail.com?subject=${encodeURIComponent(tpl.subject)}&body=${encodeURIComponent(tpl.body)}`}
                  className="mt-6 block w-full text-center rounded-md bg-electric px-4 py-3 text-sm font-semibold text-onyx-50 hover:bg-electric-glow hover:shadow-electric transition-all"
                >
                  {tpl.cta}
                </a>
              );
            })()}
            <p className="mt-2 text-[11px] text-muted-foreground text-center">Limited spots · Reply within 48h · OnyxPerformanceTeam@hotmail.com</p>
          </div>
        </aside>
      </div>

      {showOtherCoaches && (
        <section className="border-t border-border/60 bg-onyx-100/30">
          <div className="container-onyx py-16">
            <h2 className="font-display text-2xl font-bold mb-6">Other Onyx coaches</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {coaches.filter((c) => c.slug !== coach.slug).map((c) => (
                <Link key={c.slug} to="/coaches/$slug" params={{ slug: c.slug }}
                  className="group surface-card rounded-xl overflow-hidden hover:border-electric/40 transition-all">
                  <div className="relative aspect-[4/5]">
                    <img src={c.img} alt={c.name} width={400} height={500} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" decoding="async" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.tag}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
