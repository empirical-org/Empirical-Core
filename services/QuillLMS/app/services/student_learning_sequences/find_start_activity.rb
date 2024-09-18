# frozen_string_literal: true

module StudentLearningSequences
  class FindStartActivity < ApplicationService
    attr_reader :activity_id, :classroom_unit_id

    def initialize(activity_id, classroom_unit_id)
      @activity_id = activity_id
      @classroom_unit_id = classroom_unit_id
    end

    def run
      return unless activity_id && classroom_unit_id
      return activity if pre_diagnostic?

      for_recommended_activity || for_post_diagnostic
    end

    private def activity = @activity ||= Activity.find_by(id: activity_id)
    private def classroom_unit = @classroom_unit ||= ClassroomUnit.find(classroom_unit_id)

    private def pre_diagnostic? = activity.follow_up_activity_id.present?
    private def for_post_diagnostic = Activity.find_by(follow_up_activity_id: activity_id)

    private def for_recommended_activity
      Activity.joins(recommendations: {
        unit_template: {
          units: :classroom_units
        }
      }).find_by(recommendations: {
        unit_template: {
          units: {
            classroom_units: {
              id: classroom_unit_id
            }
          }
        }
      })
    end
  end
end
