import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer - Onyx Elevate" },
      { name: "description", content: "Onyx Elevate is a fitness education platform. Nothing on this site is medical advice." },
    ],
  }),
  component: () => (
    <section className="container-onyx py-16 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Legal</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Disclaimer</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <div className="mt-10 space-y-8 text-foreground/85 leading-relaxed">
        <div>
          <h2 className="font-display text-xl font-bold mb-2">Fitness education & entertainment only</h2>
          <p>Onyx Elevate is a fitness education and entertainment platform. All content, including the exercise library, training programs, recipes, nutrition guides, supplement information, articles, videos and coaching content, is provided for <strong>general informational and educational purposes only</strong>.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">Not medical advice</h2>
          <p>Nothing on Onyx Elevate is medical, physiotherapy, psychological, dietary, pharmaceutical or nutritional advice, diagnosis or treatment. Our content is <strong>not</strong> a substitute for professional medical judgement. We do not diagnose, treat, cure or prevent any disease or medical condition, and we do not prescribe exercise, food or supplements as medical intervention.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">No guaranteed results</h2>
          <p>We do <strong>not</strong> promise or guarantee any specific physical, weight-loss, body-composition, strength, performance or health outcome. Individual results vary and depend on genetics, effort, consistency, nutrition, sleep, stress, prior training history, medical history and many other factors outside our control. Testimonials and progress photos featured on the site reflect the individual experiences of those people and are not representative of what any specific user will achieve.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">Consult a qualified professional first</h2>
          <p>Physical activity carries inherent risk of injury. Before starting any exercise program, changing your diet, or using any supplement mentioned on Onyx Elevate, you must consult a qualified physician, especially if you are pregnant, nursing, under 18, over 65, sedentary, injured, recovering from surgery or illness, taking medication, or have any cardiovascular, metabolic, musculoskeletal, mental-health, endocrine or other medical condition. You use the Service entirely at your own risk.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">Supplement content</h2>
          <p>Any references to supplements are educational only. We do not sell supplements. We do not recommend specific brands, dosages or protocols as medical treatment. Supplement laws differ by country, consult a licensed pharmacist or doctor before using any product referenced on the site.</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">External links</h2>
          <p>Onyx Elevate may link to third-party websites, videos or resources. We do not endorse and are not responsible for their content or accuracy.</p>
        </div>

        <p className="text-sm text-muted-foreground">This Disclaimer forms part of our <Link to="/terms" className="text-electric underline">Terms & Conditions</Link>. By using Onyx Elevate you confirm you have read and accepted both.</p>
      </div>
    </section>
  ),
});
