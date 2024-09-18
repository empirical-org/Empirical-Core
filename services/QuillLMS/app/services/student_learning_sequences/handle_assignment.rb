# frozen_string_literal: true

module StudentLearningSequences
  class HandleAssignment < ApplicationService
    attr_reader :classroom_unit_id, :student_id

    def initialize(classroom_unit_id, student_id)
      @classroom_unit_id = classroom_unit_id
      @student_id = student_id
    end

    def run
      return unless student_learning_sequence

      assign_activities_to_sequence
    end

    private def assign_activities_to_sequence
      activities.map do |activity|
        StudentLearningSequenceActivity.find_or_create_by(activity:,
          classroom_unit:,
          student_learning_sequence:)
      end
    end

    private def activities = classroom_unit.unit_activities.map(&:activity)
    private def classroom_unit = @classroom_unit ||= ClassroomUnit.find(classroom_unit_id)
    private def initial_activity = @initial_activity ||= FindInitialActivity.run(activities&.first&.id, classroom_unit_id)
    private def initial_classroom_units = @initial_classroom_units ||= fetch_initial_classroom_units
    private def pre_diagnostic = @pre_diagnostic ||= activities.find { |a| !a.follow_up_activity_id.nil? }
    private def student = @student ||= User.find(student_id)
    private def user_id = student_id

    private def student_learning_sequence
      @student_learning_sequence ||= fetch_student_learning_sequence ||
                                     create_student_learning_sequence
    end


    private def fetch_initial_classroom_units
      return ClassroomUnit.where(id: classroom_unit_id) if pre_diagnostic

      ClassroomUnit.joins(unit: {unit_template: :activities})
        .where(unit: {unit_template: {activities: initial_activity}})
    end

    private def fetch_student_learning_sequence
      StudentLearningSequence.order(created_at: :desc)
        .find_by(
          initial_classroom_unit: initial_classroom_units,
          initial_activity:,
          user_id:)
    end

    private def create_student_learning_sequence
      # Do not create new sequences unless we're processing a pre diagnostic assignment
      return unless pre_diagnostic

      StudentLearningSequence.create(
        initial_activity: pre_diagnostic,
        initial_classroom_unit_id: classroom_unit_id,
        user_id:
      )
    end
  end
end
