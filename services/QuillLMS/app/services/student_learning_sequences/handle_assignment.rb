# frozen_string_literal: true

module StudentLearningSequences
  class HandleAssignment < ApplicationService
    attr_reader :backfill, :classroom_unit_id, :student_id

    def initialize(classroom_unit_id, student_id, backfill = false)
      @classroom_unit_id = classroom_unit_id
      @student_id = student_id
      @backfill = backfill
    end

    def run
      return unless student_learning_sequence

      assign_activities_to_sequence
    end

    private def assign_activities_to_sequence
      activities.map do |activity|
        params = {
          activity:,
          classroom_unit:,
          student_learning_sequence:
        }

        params = params.update({
          created_at: creation_timestamp,
          updated_at: creation_timestamp
        }) if backfill

        StudentLearningSequenceActivity.find_or_create_by(**params)
      end
    end

    private def classroom = classroom_unit.classroom
    private def classroom_unit = @classroom_unit ||= ClassroomUnit.find(classroom_unit_id)
    private def initial_activity = @initial_activity ||= FindInitialActivity.run(activities&.first&.id, classroom_unit_id)
    private def initial_classroom_units = @initial_classroom_units ||= fetch_initial_classroom_units
    private def student = @student ||= User.find(student_id)
    private def user_id = student_id

    private def activities
      Activity.joins(unit_activities: :classroom_units)
        .where(classroom_units: {id: classroom_unit_id})
    end

    private def pre_diagnostic
      @pre_diagnostic ||= activities.where(activity_classification_id: ActivityClassification.diagnostic)
        .where.not(follow_up_activity_id: nil)
        .first
    end

    private def creation_timestamp
      @creation_timestamp ||= backfill ? classroom_unit.updated_at : DateTime.current
    end

    private def student_learning_sequence
      @student_learning_sequence ||= fetch_student_learning_sequence ||
                                     create_student_learning_sequence
    end

    private def fetch_initial_classroom_units
      return ClassroomUnit.where(id: classroom_unit_id) if pre_diagnostic

      ClassroomUnit.joins(unit: { unit_template: :activities })
        .where(unit: { unit_template: { activities: initial_activity } })
        .where(classroom:)
        .where('? = ANY(assigned_student_ids)', student_id)
    end

    private def fetch_student_learning_sequence
      StudentLearningSequence.order(created_at: :desc)
        .find_by(
          initial_classroom_unit: initial_classroom_units,
          initial_activity:,
          user_id:
        )
    end

    private def create_student_learning_sequence
      # Do not create new sequences unless we're processing a pre diagnostic assignment
      return unless pre_diagnostic

      StudentLearningSequence.create(
        initial_activity: pre_diagnostic,
        initial_classroom_unit_id: classroom_unit_id,
        user_id:,
        created_at: creation_timestamp,
        updated_at: creation_timestamp
      )
    end
  end
end
