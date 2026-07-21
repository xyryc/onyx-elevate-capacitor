export type YogaCategory =
  | "Beginner Yoga"
  | "Morning Yoga"
  | "Mobility & Recovery"
  | "Post-Workout Stretching"
  | "Pregnancy Yoga"
  | "Senior Mobility"
  | "Lower Back Relief";

export interface YogaVideo {
  id: string;
  youtubeId: string;
  title: string;
  category: YogaCategory;
  duration: string;
  description: string;
}

export const YOGA_CATEGORIES: YogaCategory[] = [
  "Beginner Yoga",
  "Morning Yoga",
  "Mobility & Recovery",
  "Post-Workout Stretching",
  "Pregnancy Yoga",
  "Senior Mobility",
  "Lower Back Relief",
];

export const yogaVideos: YogaVideo[] = [
  {
    id: "beginner-1",
    youtubeId: "af7kn8gkafs",
    title: "Yoga for Complete Beginners",
    category: "Beginner Yoga",
    duration: "20 min",
    description:
      "A gentle, accessible introduction to foundational yoga poses and breathwork. Perfect for your very first practice.",
  },
  {
    id: "beginner-2",
    youtubeId: "v7AYKMP6rOE",
    title: "Yoga For Complete Beginners - Relaxation",
    category: "Beginner Yoga",
    duration: "20 min",
    description:
      "Slow-paced flow focused on relaxation and body awareness, ideal for building confidence on the mat.",
  },
  {
    id: "morning-1",
    youtubeId: "VaoV1PrYft4",
    title: "10-Minute Morning Yoga Full Body Stretch",
    category: "Morning Yoga",
    duration: "10 min",
    description: "A quick full-body wake-up to energize your day and loosen overnight stiffness.",
  },
  {
    id: "morning-2",
    youtubeId: "4pKly2JojMw",
    title: "Morning Yoga Flow - Energize & Awaken",
    category: "Morning Yoga",
    duration: "15 min",
    description:
      "Gentle sun-salutation-based flow to boost circulation and mental focus for the day ahead.",
  },
  {
    id: "mobility-1",
    youtubeId: "LqXZ628YNj4",
    title: "Full Body Mobility Routine",
    category: "Mobility & Recovery",
    duration: "12 min",
    description:
      "Targeted joint mobility work for hips, shoulders, and spine, great as an active recovery day.",
  },
  {
    id: "mobility-2",
    youtubeId: "6M-jm5QCLZk",
    title: "Daily Mobility Routine For Athletes",
    category: "Mobility & Recovery",
    duration: "15 min",
    description:
      "Restore range of motion and reduce stiffness with this athlete-focused mobility flow.",
  },
  {
    id: "postworkout-1",
    youtubeId: "sTANio_2E0Q",
    title: "Post Workout Stretch Routine",
    category: "Post-Workout Stretching",
    duration: "10 min",
    description: "Cool down and lengthen tight muscles after training to speed up recovery.",
  },
  {
    id: "postworkout-2",
    youtubeId: "L_xrDAtykMI",
    title: "Full Body Cool Down Stretch",
    category: "Post-Workout Stretching",
    duration: "8 min",
    description:
      "Gentle static stretches for the whole body, the perfect finisher for any workout.",
  },
  {
    id: "pregnancy-1",
    youtubeId: "ZLj_-vnn5Uc",
    title: "Prenatal Yoga - Safe For All Trimesters",
    category: "Pregnancy Yoga",
    duration: "20 min",
    description:
      "Gentle, modified poses safe for expecting mothers to build strength and ease discomfort.",
  },
  {
    id: "pregnancy-2",
    youtubeId: "6E1uZ7NoK4M",
    title: "Prenatal Yoga Flow",
    category: "Pregnancy Yoga",
    duration: "25 min",
    description:
      "A calming pregnancy flow focused on hip opening, breath, and pelvic floor awareness.",
  },
  {
    id: "senior-1",
    youtubeId: "KEjiXtb2hRg",
    title: "Chair Yoga For Seniors",
    category: "Senior Mobility",
    duration: "15 min",
    description:
      "Accessible chair-based routine to maintain flexibility, balance, and joint health.",
  },
  {
    id: "senior-2",
    youtubeId: "1DYH5ud3zHo",
    title: "Gentle Yoga For Seniors",
    category: "Senior Mobility",
    duration: "20 min",
    description:
      "Slow, low-impact movements designed for older adults to improve mobility and confidence.",
  },
  {
    id: "lowback-1",
    youtubeId: "kqtLy5CIF40",
    title: "Yoga For Lower Back Pain Relief",
    category: "Lower Back Relief",
    duration: "15 min",
    description: "Therapeutic sequence to release tension and decompress the lower back.",
  },
  {
    id: "lowback-2",
    youtubeId: "DWLp1eXAs6Y",
    title: "Lower Back Stretches - Relieve Pain",
    category: "Lower Back Relief",
    duration: "10 min",
    description: "Simple stretches to target lower back tightness and improve daily comfort.",
  },
];
