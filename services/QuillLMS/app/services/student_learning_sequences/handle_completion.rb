# frozen_string_literal: true

module StudentLearningSequences
  class HandleCompletion < ApplicationService
    attr_reader :activity_session_id

    def initialize(activity_session_id)
      @activity_session_id = activity_session_id
    end

    def run
      return unless student_learning_sequence_activity

      student_learning_sequence_activity.update(
        activity_session_id:,
        completed_at:
      )
    end

    private def activity = activity_session.activity
    private def activity_session = @activity_session ||= ActivitySession.unscoped.includes(:activity, :classroom_unit, :user).find(activity_session_id)
    private def user = activity_session.user
    private def classroom_unit = activity_session.classroom_unit
    private def completed_at = activity_session.completed_at
    private def missing_sequence_activity_error = MissingSequenceActivityError.new("Could not find StudentLearningSequenceActivity record to update for ActivitySession #{activity_session_id}")

    private def student_learning_sequence_activity
      @student_learning_sequence_activity ||= StudentLearningSequenceActivity
        .joins(:student_learning_sequence)
        .find_by(
          activity:,
          classroom_unit:,
          student_learning_sequence: {
            user:
          }
        )
    end
  end
end
