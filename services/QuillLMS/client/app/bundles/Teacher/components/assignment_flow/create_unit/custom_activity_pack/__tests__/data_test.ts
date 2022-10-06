import { Activity } from "../interfaces"

export const activities: Activity[] = [
  {
    name: "Plants: Bee Gardens",
    description: "Find and correct the errors in this passage.",
    flags: "{production}",
    id: 534,
    uid: "-KqdjKv54k5iifw2FzDk",
    anonymous_path: "/activity_sessions/anonymous?activity_id=534",
    activity_classification: {
      alias: "Quill Proofreader",
      description: "Fix Errors in Passages",
      key: "passage",
      id: 1,
    },
    activity_category: { id: 28, name: "Science: Plants" },
    activity_category_name: "Science: Plants",
    activity_category_id: 28,
    standard_level: { id: 14, name: "8th Grade CCSS" },
    standard_level_name: "8th Grade CCSS",
    standard_name: "79",
    content_partners: [
      {
        name: "Core Knowledge",
        description:
          "Core Knowledge is a free and open-source curriculum. Quill provides activities aligned with their language arts, social studies, and science books.",
        id: 1,
      },
    ],
    topics: [
      { name: "Plants", level: 1, id: 6, parent_id: null },
      { name: "Science", level: 3, id: 7, parent_id: null },
      { name: "The Earth & Nature", level: 2, id: 8, parent_id: 7 },
      { name: "Bee Gardens", level: 0, id: 251, parent_id: null },
    ],
    readability_grade_level: "8th-9th",
  }
]
