import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSharedCustomProgram, cloneCustomProgram } from "@/lib/custom-programs.functions";
import { ArrowLeft, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/shared-program/$id")({
  component: SharedProgramPage,
  head: () => ({
    meta: [
      { title: "Shared program, Onyx Elevate" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SharedProgramPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const getFn = useServerFn(getSharedCustomProgram);
  const cloneFn = useServerFn(cloneCustomProgram);

  const { data: program, isLoading } = useQuery({
    queryKey: ["shared-program", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const cloneMut = useMutation({
    mutationFn: () => cloneFn({ data: { id } }),
    onSuccess: (r) => {
      toast.success("Saved to your library");
      router.navigate({ to: "/builder/$id", params: { id: r.id } });
    },
    onError: (e: any) => toast.error(e?.message || "Couldn't save"),
  });

  if (isLoading) {
    return (
      <div className="container-onyx py-16 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-electric" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container-onyx py-16 text-center space-y-3">
        <h1 className="font-display text-2xl font-bold">Program not found</h1>
        <p className="text-sm text-muted-foreground">This link may have expired or the program was deleted.</p>
        <Link to="/builder" className="inline-flex items-center gap-1.5 text-electric underline">Go to My Programs</Link>
      </div>
    );
  }

  return (
    <div className="container-onyx py-8 max-w-3xl">
      <button
        onClick={() => router.history.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wider text-electric font-semibold">Shared program</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">{program.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {program.weeks.length} week{program.weeks.length === 1 ? "" : "s"} ·{" "}
            {program.weeks.reduce((n, w) => n + w.days.length, 0)} sessions
          </p>
        </div>
        <button
          onClick={() => cloneMut.mutate()}
          disabled={cloneMut.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow disabled:opacity-50"
        >
          {cloneMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
          Save to my library
        </button>
      </div>

      <div className="space-y-5">
        {program.weeks.map((w, wi) => (
          <section key={wi} className="rounded-2xl border border-border bg-onyx-100 p-5">
            <h2 className="font-display text-xl font-semibold mb-3">{w.name}</h2>
            <div className="grid gap-3">
              {w.days.map((d, di) => (
                <div key={di} className="rounded-xl border border-border/60 bg-onyx-50 p-4">
                  <div className="font-semibold text-sm mb-2">{d.name}</div>
                  {d.exercises.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Rest day</p>
                  ) : (
                    <ul className="divide-y divide-border/60">
                      {d.exercises.map((e, ei) => {
                        const meta = [
                          e.sets && `${e.sets} sets`,
                          e.reps && `${e.reps} reps`,
                          e.rpe && `RPE ${e.rpe}`,
                          e.rest && `${e.rest} rest`,
                          e.tempo && `tempo ${e.tempo}`,
                        ].filter(Boolean).join(" · ");
                        return (
                          <li key={ei} className="py-2.5 first:pt-0 last:pb-0">
                            <Link
                              to="/exercises/$slug"
                              params={{ slug: e.exerciseSlug }}
                              className="group inline-flex items-center gap-2 text-foreground hover:text-electric transition-colors"
                              title="Watch demo video"
                            >
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-electric/15 border border-electric/30 group-hover:bg-electric/30 transition-colors shrink-0">
                                <svg className="h-3 w-3 text-electric translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </span>
                              <span data-no-translate className="font-semibold text-sm underline-offset-4 group-hover:underline">
                                {e.exerciseName}
                              </span>
                            </Link>
                            {meta && (
                              <div className="mt-1 pl-8 text-xs text-muted-foreground">{meta}</div>
                            )}
                            {e.notes && (
                              <div className="mt-0.5 pl-8 text-xs text-muted-foreground italic">{e.notes}</div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
