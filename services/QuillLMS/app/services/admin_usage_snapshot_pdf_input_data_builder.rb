# frozen_string_literal: true

class AdminUsageSnapshotPdfInputDataBuilder < ApplicationService
  attr_reader :admin_report_filter_selection

  GRADE_OPTION_NAMES = SnapshotsController::GRADE_OPTIONS.pluck(:name).sort.freeze

  COUNT = 'count'
  FEEDBACK = 'feedback'
  MEDIUM = 'medium'
  SMALL = 'small'
  RANKING = 'ranking'

  delegate :filter_selections, to: :admin_report_filter_selection

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

    def run = [highlights, users, practice, classrooms, schools]

    private def classrooms
      {
        className: 'classrooms',
        name: 'Classrooms',
        itemGroupings: [
          {
            className: 'counts',
            items: [
              {
                count: 2,
                change: 100,
                label: 'Active classrooms',
                singular_label: 'Active classroom',
                size: SMALL,
                type: COUNT,
                queryKey: 'active-classrooms'
              },
              {
                count: 2,
                change: nil,
                label: 'Average active classrooms per teacher',
                size: SMALL,
                type: COUNT,
                queryKey: 'average-active-classrooms-per-teacher'
              },
              {
                count: 0,
                change: nil,
                label: 'Classrooms created',
                singular_label: 'Classroom created',
                size: SMALL,
                type: COUNT,
                queryKey: 'classrooms-created'
              },
              {
                count: 5,
                change: -17,
                label: 'Average active students per classroom',
                size: SMALL,
                type: COUNT,
                queryKey: 'average-active-students-per-classroom'
              }
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
                data: [{name: '11', count: 31}, {name: '10', count: 23}]
              }
            ]
          }
        ]
      }
    end

    private def highlights
      {
        className: 'highlights',
        name: 'Highlights',
        itemGroupings: [
          {
            className: 'counts',
            items: [
              {
                size: MEDIUM,
                type: COUNT,
                queryKey: 'sentences-written',
                change: -42,
                count: 406,
                label: 'Sentences written'
              },
              {
                size: MEDIUM,
                type: COUNT,
                queryKey: 'student-learning-hours',
                change: 40,
                count: 7,
                label: 'Student learning hours'
              }
            ]
          }
        ]
      }
    end

    private def practice
      {
        className: 'practice',
        name: 'Practice',
        itemGroupings: [
          {
            className: 'first-row',
            items: [
              {
                label: 'Activities assigned',
                singular_label: 'Activity assigned',
                count: 48,
                change: 500,
                size: SMALL,
                type: COUNT,
                queryKey: 'activities-assigned'
              },
              {
                count: 54,
                change: -25,
                label: 'Activities completed',
                singular_label: 'Activity completed',
                size: SMALL,
                type: COUNT,
                queryKey: 'activities-completed'
              },
              {
                count: 12,
                change: -50,
                label: 'Activity packs assigned',
                singular_label: 'Activity pack assigned',
                size: SMALL,
                type: COUNT,
                queryKey: 'activity-packs-assigned'
              },
              {
                count: 3,
                change: -77,
                label: 'Activity packs completed',
                singular_label: 'Activity pack completed',
                size: SMALL,
                type: COUNT,
                queryKey: 'activity-packs-completed'
              }
            ]
          },
          {
            className: 'second-row',
            items: [
              {
                label: 'Top concepts assigned',
                type: RANKING,
                queryKey: 'top-concepts-assigned',
                headers: ['Concept', 'Activities assigned'],
                data: [{name: 'Complex Sentences', count: 48}]
              },
              {
                label: 'Top concepts practiced',
                type: RANKING,
                queryKey: 'top-concepts-practiced',
                headers: ['Concept', 'Activities completed'],
                data: [{name: 'Complex Sentences', count: 48}, {name: 'Verbs', count: 16}, {name: 'Nouns', count: 4}]
              }
            ]
          },
          {
            className: 'third-and-fourth-row',
            items: [
              {
                count: 0,
                change: nil,
                label: 'Baseline diagnostics assigned',
                singular_label: 'Baseline diagnostic assigned',
                size: SMALL,
                type: COUNT,
                queryKey: 'baseline-diagnostics-assigned'
              },
              {
                count: 0,
                change: -100,
                label: 'Baseline diagnostics completed',
                singular_label: 'Baseline diagnostic completed',
                size: SMALL,
                type: COUNT,
                queryKey: 'baseline-diagnostics-completed'
              },
              {
                count: 0,
                change: -100,
                label: 'Growth diagnostics assigned',
                singular_label: 'Growth diagnostic assigned',
                size: SMALL,
                type: COUNT,
                queryKey: 'growth-diagnostics-assigned'
              },
              {
                count: 0,
                change: -100,
                label: 'Growth diagnostics completed',
                singular_label: 'Growth diagnostic completed',
                size: SMALL,
                type: COUNT,
                queryKey: 'growth-diagnostics-completed'
              },
              {
                count: 6,
                change: -50,
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
                data: [{name: 'Joining Words &amp; Describing Words - Coral Reefs', count: 6}, {name: 'Subordinating Conjunctions - Playing Football', count: 6}],
                headers: ['Activity', 'Activities completed']
              },
              {
                label: 'Most completed activities',
                type: RANKING,
                queryKey: 'most-completed-activities',
                data: [{name: 'Time Conjunctions - Volcanoes', count: 75}, {name: 'As Soon As &amp; Until - Honeybees', count: 5}, {name: 'Although, Even though, Though, &amp; While at the Beginning - Sea Turtles', count: 5}],
                headers: ['Activity', 'Activities completed']
              }
            ]
          }
        ]
      }
    end

    private def users
      {
        className: 'users',
        name: 'Users',
        itemGroupings: [
          {
            className: 'counts',
            items: [
              {
                size: SMALL,
                type: COUNT,
                queryKey: 'active-teachers',
                change: 0,
                count: 1,
                label: 'Active teachers'
              },
              {
                size: SMALL,
                type: COUNT,
                queryKey: 'active-students',
                change: 50,
                count: 9,
                label: 'Active students'
              },
              {
                size: SMALL,
                type: COUNT,
                queryKey: 'teacher-accounts-created',
                change: 0,
                count: 0,
                label: 'Teacher accounts created'
              },
              {
                size: SMALL,
                type: COUNT,
                queryKey: 'student-accounts-created',
                change: -100,
                count: 0,
                label: 'Student accounts created'
              }
            ],
          },
          {
            className: RANKING,
            items: [
              {
                type: RANKING,
                queryKey: 'most-active-teachers',
                headers: ['Teacher', 'Activities completed'],
                label: 'Most active teachers',
                data: [{name: 'Ms. Smith', count: 100}, {name: 'Mr. Jones', count: 50}]
              }
            ]
          }
        ]
      }
    end

    private def schools
      {
        name: 'Schools',
        className: 'schools',
        itemGroupings: [
          {
            className: RANKING,
            items: [
              {
                data: [{name: 'Douglass High School', count: 54}],
                label: 'Most active schools',
                type: RANKING,
                queryKey: 'most-active-schools',
                headers: ['School', 'Activities completed']
              }
            ]
          }
        ]
      }
    end

  end
end


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
