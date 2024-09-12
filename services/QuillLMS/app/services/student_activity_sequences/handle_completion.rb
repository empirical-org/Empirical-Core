# frozen_string_literal: true

module StudentActivitySequences
  class HandleCompletion < ApplicationService
    class MissingSequenceActivityError < StandardError; end

    attr_reader :activity_session_id

    def initialize(activity_session_id)
      @activity_session_id = activity_session_id
    end

    def run
      raise missing_sequence_activity_error unless student_activity_sequence_activity

      student_activity_sequence_activity.update(
        activity_session_id:,
        completed_at:
      )
    end

    private def activity = activity_session.activity
    private def activity_session = @activity_session ||= ActivitySession.includes(:activity, :classroom_unit, :user).find(activity_session_id)
    private def user = activity_session.user
    private def classroom_unit = activity_session.classroom_unit
    private def completed_at = activity_session.completed_at
    private def missing_sequence_activity_error = MissingSequenceActivityError.new("Could not find StudentActivitySequenceActivity record to update for ActivitySession #{activity_session_id}")

    private def student_activity_sequence_activity
      @student_activity_sequence_activity ||= StudentActivitySequenceActivity
        .joins(:student_activity_sequence)
        .find_by(
          activity:,
          classroom_unit:,
          student_activity_sequence: {
            user:
          }
        )
    end
  end
end
