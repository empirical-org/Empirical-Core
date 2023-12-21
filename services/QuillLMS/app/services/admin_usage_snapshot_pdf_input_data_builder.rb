# frozen_string_literal: true

class AdminUsageSnapshotPdfInputDataBuilder < ApplicationService
  attr_reader :admin_report_filter_selection

  GRADE_OPTION_NAMES = SnapshotsController::GRADE_OPTIONS.pluck(:name).sort.freeze

  IMG_SRC_PREFIX = "https://assets.quill.org/images/pages/administrator/usage_snapshot_report"
  ARROW_DOWN_IMG_SRC = "#{IMG_SRC_PREFIX}/arrow_down_icon.svg"
  ARROW_UP_IMG_SRC = "#{IMG_SRC_PREFIX}/arrow_up_icon.svg"
  BULB_IMG_SRC = "#{IMG_SRC_PREFIX}/bulb.svg"
  STUDENTS_IMG_SRC = "#{IMG_SRC_PREFIX}/students.svg"
  ARROW_POINTING_DOWN = { alt: 'Arrow pointing down',  src: ARROW_DOWN_IMG_SRC }.freeze
  ARROW_POINTING_UP = { alt: 'Arrow pointing up',  src: ARROW_UP_IMG_SRC }.freeze

  delegate :filter_selections, to: :admin_report_filter_selection

  # SECTION_NAME_TO_ICON_URL = {
  #  all: `${iconLinkBase}/outlined_star.svg`,
  #   highlights: `${iconLinkBase}/bulb.svg`,
  # [USERS]: `${iconLinkBase}/students.svg`,
  # [PRACTICE]: `${iconLinkBase}/pencil.svg`,
  # [CLASSROOMS]: `${iconLinkBase}/teacher.svg`,
  # [SCHOOLS]: `${iconLinkBase}/school.svg`
  # ]

  def initialize(admin_report_filter_selection)
    @admin_report_filter_selection = admin_report_filter_selection
  end

  def run
    {
      filter_sections: FilterSectionsBuilder.run(filter_selections),
      snapshot_sections: SnapshotSectionsBuilder.run(filter_selections)
    }
  end

  class FilterSectionsBuilder < ApplicationService
    attr_reader :filter_selections

    def initialize(filter_selections)
      @filter_selections = filter_selections
    end

    def run = { classrooms:, grades:, schools:, teachers:, timeframe: }

    private def all_grades? = raw_grades.sort.eql?(GRADE_OPTION_NAMES)
    private def classrooms = filter_selections['classrooms']&.pluck('name')
    private def grades = all_grades? ? nil : raw_grades
    private def raw_grades = filter_selections['grades']&.pluck('name')
    private def schools = filter_selections['schools']&.pluck('name')
    private def teachers = filter_selections['teachers']&.pluck('name')
    private def timeframe = filter_selections['timeframe']['name']
  end

  class SnapshotSectionsBuilder < ApplicationService
    attr_reader :filter_selections

    def initialize(filter_selections)
      @filter_selections = filter_selections
    end

    def run = { highlights:, practice:, classrooms:, schools:, users: }

    private def highlights
      {
        img_src: BULB_IMG_SRC,
        title: 'Highlights',
        size: 'medium',
        count_items: [
          { query_key: 'sentences-written', change_direction: 'negative', change: 42, count: 406, label: 'Sentences written', change_icon: change_icon(-42) },
          { query_key: 'student-learning-hours', change_direction: 'positive', change: 40, count: 7, label: 'Student learning hours', change_icon: change_icon(40) }
        ]
      }
    end

    private def change_icon(change)
      return if change.zero?

      change.positive? ? ARROW_POINTING_UP : ARROW_POINTING_DOWN
    end

    private def practice = {}
    private def classrooms = {}
    private def schools = {}
    private def users
      {
        img_src: STUDENTS_IMG_SRC,
        title: 'Users',
        size: 'small',
        count_items: [
          { query_key: 'active-teachers', change_direction: 'no change', change: 0, count: 1, label: 'Active teachers', change_icon: change_icon(0) },
          { query_key: 'active-students', change_direction: 'positive', change: 50, count: 9, label: 'Active students', change_icon: change_icon(50) },
          { query_key: 'teacher-accounts-created', change_direction: 'no change', change: 0, count: 0, label: 'Teacher accounts created', change_icon: change_icon(0) },
          { query_key: 'student-accounts-created', change_direction: 'negative', change: 100, count: 0, label: 'Student accounts created', change_icon: change_icon(-100) }
        ],
        ranking_items: [
          {
            query_key: 'most-active-teachers',
            headers: ['Teacher', 'Activities completed'],
            label: 'Most active teachers',
            data: [{name: 'Ms. Smith', count: 100}, {name: 'Mr. Jones', count: 50}]
          }
        ]
      }
    end
  end
end


# export const snapshotSections = [
#   {
#   {
#     name: USERS,
#     className: 'users',
#     itemGroupings: [
#       {
#         className: 'rankings',
#         items: [
#           {
#             label: 'Most active teachers',
#             type: RANKING,
#             queryKey: 'most-active-teachers',
#             headers: ['Teacher', 'Activities completed']
#           },
#         ]
#       }
#     ]
#   },
#   {
#     name: PRACTICE,
#     className: 'practice',
#     itemGroupings: [
#       {
#         className: 'first-row',
#         items: [
#           {
#             label: 'Activities assigned',
#             singularLabel: 'Activity assigned',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'activities-assigned'
#           },
#           {
#             label: 'Activities completed',
#             singularLabel: 'Activity completed',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'activities-completed'
#           },
#           {
#             label: 'Activity packs assigned',
#             singularLabel: 'Activity pack assigned',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'activity-packs-assigned'
#           },
#           {
#             label: 'Activity packs completed',
#             singularLabel: 'Activity pack completed',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'activity-packs-completed'
#           },
#         ]
#       },
#       {
#         className: 'second-row',
#         items: [
#           {
#             label: 'Top concepts assigned',
#             type: RANKING,
#             queryKey: 'top-concepts-assigned',
#             headers: ['Concept', 'Activities assigned']
#           },
#           {
#             label: 'Top concepts practiced',
#             type: RANKING,
#             queryKey: 'top-concepts-practiced',
#             headers: ['Concept', 'Activities completed']
#           }
#         ]
#       },
#       {
#         className: 'third-and-fourth-row',
#         items: [
#           {
#             label: 'Baseline diagnostics assigned',
#             singularLabel: 'Baseline diagnostic assigned',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'baseline-diagnostics-assigned'
#           },
#           {
#             label: 'Baseline diagnostics completed',
#             singularLabel: 'Baseline diagnostic completed',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'baseline-diagnostics-completed'
#           },
#           {
#             label: 'Growth diagnostics assigned',
#             singularLabel: 'Growth diagnostic assigned',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'growth-diagnostics-assigned'
#           },
#           {
#             label: 'Growth diagnostics completed',
#             singularLabel: 'Growth diagnostic completed',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'growth-diagnostics-completed'
#           },
#           {
#             label: 'Average activities completed per student',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'average-activities-completed-per-student'
#           },
#           {
#             type: FEEDBACK
#           }
#         ]
#       },
#       {
#         className: 'fifth-row',
#         items: [
#           {
#             label: 'Most assigned activities',
#             type: RANKING,
#             queryKey: 'most-assigned-activities',
#             headers: ['Activity', 'Activities completed']
#           },
#           {
#             label: 'Most completed activities',
#             type: RANKING,
#             queryKey: 'most-completed-activities',
#             headers: ['Activity', 'Activities completed']
#           }
#         ]
#       },
#     ]
#   },
#   {
#     name: CLASSROOMS,
#     className: 'classrooms',
#     itemGroupings: [
#       {
#         className: "counts",
#         items: [
#           {
#             label: 'Active classrooms',
#             singularLabel: 'Active classroom',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'active-classrooms'
#           },
#           {
#             label: 'Average active classrooms per teacher',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'average-active-classrooms-per-teacher'
#           },
#           {
#             label: 'Classrooms created',
#             singularLabel: 'Classroom created',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'classrooms-created'
#           },
#           {
#             label: 'Average active students per classroom',
#             size: SMALL,
#             type: COUNT,
#             queryKey: 'average-active-students-per-classroom'
#           },
#         ]
#       },
#       {
#         className: 'rankings',
#         items: [
#           {
#             label: 'Most active grades',
#             type: RANKING,
#             queryKey: 'most-active-grades',
#             headers: ['Grade', 'Activities completed']
#           },
#         ]
#       }
#     ]
#   },
#   {
#     name: SCHOOLS,
#     className: 'schools',
#     itemGroupings: [
#       {
#         className: 'ranking',
#         items: [
#           {
#             label: 'Most active schools',
#             type: RANKING,
#             queryKey: 'most-active-schools',
#             headers: ['School', 'Activities completed']
#           },
#         ]
#       }
#     ]
#   }
# ]

# if (changeDirection === NONE && count !== NOT_APPLICABLE) {
#   className += ' no-change'
# } else if (changeDirection !== NONE) {
#   className += ` ${changeDirection}`
# }

# let icon

# if (changeDirection === POSITIVE) {
#   icon = size === SMALL ? smallArrowUpIcon : mediumArrowUpIcon
# } else if (changeDirection === NEGATIVE) {
#   icon = size === SMALL ? smallArrowDownIcon : mediumArrowDownIcon
# }


#   const roundedPrevious = Math.round(previous || 0)

#   const changeTotal = Math.round(((count - roundedPrevious) / (roundedPrevious || 1)) * 100)
#   setChange(Math.abs(changeTotal))
#   if (changeTotal) {
#     setChangeDirection(changeTotal > 0 ? POSITIVE : NEGATIVE)
#   } else {
#     setChangeDirection(NONE)
#   }
# }, [count, previous])

# function resetToDefault() {
#   setCount(passedCount || null)
#   setChangeDirection(passedChangeDirection || null)
#   setChange(passedChange || 0)
# }
