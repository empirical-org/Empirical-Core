# frozen_string_literal: true

module Pdfs
  module AdminUsageSnapshotReports
    class SnapshotSectionsBuilder < ApplicationService
      COUNT = 'count'
      FEEDBACK = 'feedback'
      MEDIUM = 'medium'
      SMALL = 'small'
      RANKING = 'ranking'

      attr_reader :admin_report_filter_selection

      def initialize(admin_report_filter_selection)
        @admin_report_filter_selection = admin_report_filter_selection
      end

      def run
        [highlights, users, practice, classrooms, schools].map do |section|
          section.merge(itemGroupings: updated_groupings(section))
        end
      end

      private def updated_groupings(section)
        section[:itemGroupings].map { |grouping| grouping.merge(items: updated_items(grouping)) }
      end

      private def updated_items(grouping)
        grouping[:items].map { |item| inject_data(item) }
      end

      private def inject_data(item)
        return item unless item[:queryKey]
        return CountDataInjector.run(item:, admin_report_filter_selection:) if item[:type] == COUNT
        return RankingDataInjector.run(item:, admin_report_filter_selection:) if item[:type] == RANKING

        item
      end

      private def classrooms
        {
          className: 'classrooms',
          name: 'Classrooms',
          itemGroupings: [
            {
              className: 'counts',
              items: [
                {
                  label: 'Active classrooms',
                  queryKey: 'active-classrooms',
                  singularLabel: 'Active classroom',
                  size: SMALL,
                  type: COUNT,
                },
                {
                  label: 'Average active classrooms per teacher',
                  queryKey: 'average-active-classrooms-per-teacher',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Classrooms created',
                  queryKey: 'classrooms-created',
                  singularLabel: 'Classroom created',
                  size: SMALL,
                  type: COUNT,
                },
                {
                  label: 'Average active students per classroom',
                  queryKey: 'average-active-students-per-classroom',
                  size: SMALL,
                  type: COUNT
                }
              ]
            },
            {
              className: 'rankings',
              items: [
                {
                  headers: ['Grade', 'Activities completed'],
                  label: 'Most active grades',
                  queryKey: 'most-active-grades',
                  type: RANKING,
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
                  label: 'Sentences written'
                },
                {
                  size: MEDIUM,
                  type: COUNT,
                  queryKey: 'student-learning-hours',
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
                  queryKey: 'activities-assigned',
                  singularLabel: 'Activity assigned',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Activities completed',
                  queryKey: 'activities-completed',
                  singularLabel: 'Activity completed',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Activity packs assigned',
                  queryKey: 'activity-packs-assigned',
                  singularLabel: 'Activity pack assigned',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Activity packs completed',
                  queryKey: 'activity-packs-completed',
                  singularLabel: 'Activity pack completed',
                  size: SMALL,
                  type: COUNT,
                }
              ]
            },
            {
              className: 'second-row',
              items: [
                {
                  headers: ['Concept', 'Activities assigned'],
                  label: 'Top concepts assigned',
                  queryKey: 'top-concepts-assigned',
                  type: RANKING
                },
                {
                  headers: ['Concept', 'Activities completed'],
                  label: 'Top concepts practiced',
                  queryKey: 'top-concepts-practiced',
                  type: RANKING
                }
              ]
            },
            {
              className: 'third-and-fourth-row',
              items: [
                {
                  label: 'Baseline diagnostics assigned',
                  queryKey: 'baseline-diagnostics-assigned',
                  singularLabel: 'Baseline diagnostic assigned',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Baseline diagnostics completed',
                  queryKey: 'baseline-diagnostics-completed',
                  singularLabel: 'Baseline diagnostic completed',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Growth diagnostics assigned',
                  queryKey: 'growth-diagnostics-assigned',
                  singularLabel: 'Growth diagnostic assigned',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Growth diagnostics completed',
                  queryKey: 'growth-diagnostics-completed',
                  singularLabel: 'Growth diagnostic completed',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Average activities completed per student',
                  queryKey: 'average-activities-completed-per-student',
                  size: SMALL,
                  type: COUNT
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
                  headers: ['Activity', 'Activities completed'],
                  queryKey: 'most-assigned-activities',
                  label: 'Most assigned activities',
                  type: RANKING
                },
                {
                  headers: ['Activity', 'Activities completed'],
                  label: 'Most completed activities',
                  queryKey: 'most-completed-activities',
                  type: RANKING
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
                  label: 'Active teachers',
                  queryKey: 'active-teachers',
                  singularLabel: 'Active teacher',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Active students',
                  queryKey: 'active-students',
                  singularLabel: 'Active student',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Teacher accounts created',
                  queryKey: 'teacher-accounts-created',
                  singularLabel: 'Teacher account created',
                  size: SMALL,
                  type: COUNT
                },
                {
                  label: 'Student accounts created',
                  queryKey: 'student-accounts-created',
                  singularLabel: 'Student account created',
                  size: SMALL,
                  type: COUNT,
                }
              ],
            },
            {
              className: RANKING,
              items: [
                {
                  headers: ['Teacher', 'Activities completed'],
                  label: 'Most active teachers',
                  queryKey: 'most-active-teachers',
                  type: RANKING
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
                  headers: ['School', 'Activities completed'],
                  label: 'Most active schools',
                  queryKey: 'most-active-schools',
                  type: RANKING
                }
              ]
            }
          ]
        }
      end
    end
  end
end
