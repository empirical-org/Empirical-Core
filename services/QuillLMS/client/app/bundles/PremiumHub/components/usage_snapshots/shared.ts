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
            size: MEDIUM,
            type: COUNT,
            queryKey: 'sentences-written'
          },
          {
            label: 'Student learning hours',
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
            size: SMALL,
            type: COUNT,
            queryKey: 'active-teachers'
          },
          {
            label: 'Active students',
            size: SMALL,
            type: COUNT,
            queryKey: 'active-students'
          },
          {
            label: 'Teacher accounts created',
            size: SMALL,
            type: COUNT,
            queryKey: 'teacher-accounts-created',
            comingSoon: true
          },
          {
            label: 'Student accounts created',
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
            size: SMALL,
            type: COUNT,
            queryKey: 'activities-assigned'
          },
          {
            label: 'Activities completed',
            size: SMALL,
            type: COUNT,
            queryKey: 'activities-completed'
          },
          {
            label: 'Activity packs assigned',
            size: SMALL,
            type: COUNT,
            queryKey: 'activity-packs-assigned',
            comingSoon: true
          },
          {
            label: 'Activity packs completed',
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
            size: SMALL,
            type: COUNT,
            queryKey: 'baseline-diagnostics-assigned',
            comingSoon: true
          },
          {
            label: 'Baseline diagnostics completed',
            size: SMALL,
            type: COUNT,
            queryKey: 'baseline-diagnostics-completed',
            comingSoon: true
          },
          {
            label: 'Growth diagnostics assigned',
            size: SMALL,
            type: COUNT,
            queryKey: 'growth-diagnostics-assigned',
            comingSoon: true
          },
          {
            label: 'Growth diagnostics completed',
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
