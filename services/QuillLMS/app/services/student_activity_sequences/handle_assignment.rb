# frozen_string_literal: true

module StudentActivitySequences
  class HandleAssignment < ApplicationService
    attr_reader :classroom_unit_id, :student_id
  
    def initialize(classroom_unit_id, student_id)
      @classroom_unit_id = classroom_unit_id
      @student_id = student_id
    end

    def run
      return unless student_activity_sequence

      assign_activities_to_sequence
    end

    private def assign_activities_to_sequence
      activities.map do |activity|
        StudentActivitySequenceActivity.find_or_create_by(activity:,
          classroom_unit:,
          student_activity_sequence:)
      end
    end

    private def activities = classroom_unit.unit_activities.map(&:activity)
    private def classroom_unit = @classroom_unit ||= ClassroomUnit.find(classroom_unit_id)
    private def initial_activity = @initial_activity ||= FindStartActivity.run(activities&.first&.id, classroom_unit_id)
    private def pre_diagnostic = @pre_diagnostic ||= activities.find { |a| a.follow_up_activity_id != nil }
    private def student = @student ||= User.find(student_id)
    private def user_id = student_id

    private def student_activity_sequence
      @student_activity_sequence ||= fetch_student_activity_sequence ||
        create_student_activity_sequence
    end

    private def fetch_student_activity_sequence
      query = StudentActivitySequence.order(created_at: :desc)

      # Pre diagnostics are the start of a sequence, so only find "existing" ones if they're for the specific assignment
      query = query.where(initial_classroom_unit_id: classroom_unit_id) if pre_diagnostic

      query.find_by(
        classroom_id: classroom_unit.classroom_id,
        initial_activity:,
        user_id:)
    end

    private def create_student_activity_sequence
      # Do not create new sequences unless we're processing a pre diagnostic assignment
      return unless pre_diagnostic

      StudentActivitySequence.create(
        classroom_id: classroom_unit.classroom_id,
        initial_activity: pre_diagnostic,
        initial_classroom_unit_id: classroom_unit_id,
        user_id:)
    end
  end
end
