import { createFileRoute } from "@tanstack/react-router";
import { ProgramQuiz } from "@/components/ProgramQuiz";

export const Route = createFileRoute("/quiz")({
  component: ProgramQuiz,
  head: () => ({
    meta: [
      { title: "Find Your Program · Onyx Elevate" },
      {
        name: "description",
        content:
          "Answer 7 quick questions and we'll match you to the perfect Onyx training program.",
      },
      { property: "og:title", content: "Find Your Program · Onyx Elevate" },
      {
        property: "og:description",
        content:
          "Answer 7 quick questions and we'll match you to the perfect Onyx training program.",
      },
    ],
  }),
});
