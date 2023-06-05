// interfaces
export interface Grade {
  label: string;
  name: string;
  value: string;
}

export interface School {
  label: string;
  name: string;
  value: number;
  id: number;
}

export interface Timeframe {
  label: string;
  name: string;
  value: string;
  default: boolean;
}

// sizes
export const SMALL = 'small'
export const MEDIUM = 'medium'

// change directions
export const POSITIVE = 'positive'
export const NEGATIVE = 'negative'

// snapshot item types
export const COUNT = 'count'
export const RANKING = 'ranking'
export const FEEDBACK = 'feedback'

// section names
export const ALL = 'All'
const HIGHLIGHTS = 'Highlights'
const USERS = 'Users'
const PRACTICE = 'Practice'
const CLASSROOMS = 'Classrooms'
const SCHOOLS = 'Schools'

// custom date
export const CUSTOM = 'custom'

export const TAB_NAMES = [ALL, HIGHLIGHTS, USERS, PRACTICE, CLASSROOMS, SCHOOLS]

export const snapshotSections = [
  {
    name: HIGHLIGHTS,
    className: 'highlights',
    itemGroupings: [
      {
        className: "counts",
        items: [
          {
            label: 'Sentences written',
            singularLabel: 'Sentence written',
            size: MEDIUM,
            type: COUNT,
            queryKey: 'sentences-written'
          },
          {
            label: 'Student learning hours',
            singularLabel: 'Student learning hour',
            size: MEDIUM,
            type: COUNT,
            queryKey: 'student-learning-hours'
          }
        ]
      }
    ]
  },
  {
    name: USERS,
    className: 'users',
    itemGroupings: [
      {
        className: "counts",
        items: [
          {
            label: 'Active teachers',
            singularLabel: 'Active teacher',
            size: SMALL,
            type: COUNT,
            queryKey: 'active-teachers',
            comingSoon: true
          },
          {
            label: 'Active students',
            singularLabel: 'Active student',
            size: SMALL,
            type: COUNT,
            queryKey: 'active-students'
          },
          {
            label: 'Teacher accounts created',
            singularLabel: 'Teacher account created',
            size: SMALL,
            type: COUNT,
            queryKey: 'teacher-accounts-created',
            comingSoon: true
          },
          {
            label: 'Student accounts created',
            singularLabel: 'Student account created',
            size: SMALL,
            type: COUNT,
            queryKey: 'student-accounts-created',
            comingSoon: true
          },
        ]
      },
      {
        className: 'rankings',
        items: [
          {
            label: 'Most active teachers',
            type: RANKING,
            queryKey: 'most-active-teachers',
            headers: ['Teacher', 'Activities completed'],
            comingSoon: true
          },
        ]
      }
    ]
  },
  {
    name: PRACTICE,
    className: 'practice',
    itemGroupings: [
      {
        className: 'first-row',
        items: [
          {
            label: 'Activities assigned',
            singularLabel: 'Activity assigned',
            size: SMALL,
            type: COUNT,
            queryKey: 'activities-assigned'
          },
          {
            label: 'Activities completed',
            singularLabel: 'Activity completed',
            size: SMALL,
            type: COUNT,
            queryKey: 'activities-completed'
          },
          {
            label: 'Activity packs assigned',
            singularLabel: 'Activity pack assigned',
            size: SMALL,
            type: COUNT,
            queryKey: 'activity-packs-assigned',
            comingSoon: true
          },
          {
            label: 'Activity packs completed',
            singularLabel: 'Activity pack completed',
            size: SMALL,
            type: COUNT,
            queryKey: 'activity-packs-completed',
            comingSoon: true
          },
        ]
      },
      {
        className: 'second-row',
        items: [
          {
            label: 'Top concepts assigned',
            type: RANKING,
            queryKey: 'top-concepts-assigned',
            headers: ['Concept', 'Activities assigned']
          },
          {
            label: 'Top concepts practiced',
            type: RANKING,
            queryKey: 'top-concepts-practiced',
            headers: ['Concept', 'Activities completed']
          }
        ]
      },
      {
        className: 'third-and-fourth-row',
        items: [
          {
            label: 'Baseline diagnostics assigned',
            singularLabel: 'Baseline diagnostic assigned',
            size: SMALL,
            type: COUNT,
            queryKey: 'baseline-diagnostics-assigned',
            comingSoon: true
          },
          {
            label: 'Baseline diagnostics completed',
            singularLabel: 'Baseline diagnostic completed',
            size: SMALL,
            type: COUNT,
            queryKey: 'baseline-diagnostics-completed',
            comingSoon: true
          },
          {
            label: 'Growth diagnostics assigned',
            singularLabel: 'Growth diagnostic assigned',
            size: SMALL,
            type: COUNT,
            queryKey: 'growth-diagnostics-assigned',
            comingSoon: true
          },
          {
            label: 'Growth diagnostics completed',
            singularLabel: 'Growth diagnostic completed',
            size: SMALL,
            type: COUNT,
            queryKey: 'growth-diagnostics-completed',
            comingSoon: true
          },
          {
            label: 'Average activities completed per student',
            size: SMALL,
            type: COUNT,
            queryKey: 'average-activities-completed-per-student'
          },
          {
            type: FEEDBACK
          }
        ]
      },
      {
        className: 'fifth-row',
        items: [
          {
            label: 'Most assigned activities',
            type: RANKING,
            queryKey: 'most-assigned-activities',
            headers: ['Activity', 'Activities completed'],
            comingSoon: true
          },
          {
            label: 'Most completed activities',
            type: RANKING,
            queryKey: 'most-completed-activities',
            headers: ['Activity', 'Activities completed'],
            comingSoon: true
          }
        ]
      },
    ]
  },
  {
    name: CLASSROOMS,
    className: 'classrooms',
    itemGroupings: [
      {
        className: "counts",
        items: [
          {
            label: 'Active classrooms',
            singularLabel: 'Active classroom',
            size: SMALL,
            type: COUNT,
            queryKey: 'active-classrooms'
          },
          {
            label: 'Average active classrooms per teacher',
            size: SMALL,
            type: COUNT,
            queryKey: 'average-active-classrooms-per-teacher',
            comingSoon: true
          },
          {
            label: 'Classrooms created',
            singularLabel: 'Classroom created',
            size: SMALL,
            type: COUNT,
            queryKey: 'classrooms-created',
            comingSoon: true
          },
          {
            label: 'Average active students per classroom',
            size: SMALL,
            type: COUNT,
            queryKey: 'average-active-students-per-classroom',
            comingSoon: true
          },
        ]
      },
      {
        className: 'rankings',
        items: [
          {
            label: 'Most active grades',
            type: RANKING,
            queryKey: 'most-active-grades',
            headers: ['Grade', 'Activities completed'],
            comingSoon: true
          },
        ]
      }
    ]
  },
  {
    name: SCHOOLS,
    className: 'schools',
    itemGroupings: [
      {
        className: 'ranking',
        items: [
          {
            label: 'Most active schools',
            type: RANKING,
            queryKey: 'most-active-schools',
            headers: ['School', 'Activities completed']
          },
        ]
      }
    ]
  }
]

export function unorderedArraysAreEqual(arr1, arr2) {
  if (arr1?.length !== arr2?.length) {
    return false;
  }

  // Create a copy of the second array
  const arr2Copy = [...arr2];

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2Index = arr2Copy.findIndex(obj => objectsAreEqual(obj, obj1));

    if (obj2Index === -1) {
      return false;
    }

    // Remove the matched object from the copy
    arr2Copy.splice(obj2Index, 1);
  }

  return true;
}

function objectsAreEqual(obj1, obj2) {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  for (let key of obj1Keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
