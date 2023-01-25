# frozen_string_literal: true

class ClassroomStudentsDiagnosticProgressAggregator < ApplicationService
  attr_reader :classroom, :student_ids, :units

  def initialize(classroom, student_ids, units)
    @classroom = classroom
    @student_ids = student_ids
    @units = units
  end

  def run
    return {} if student_ids.empty? || units.empty?

    student_ids
      .to_h { |student_id| [student_id, 0] }
      .merge(student_ids_with_completed_activity_sessions_counts)
  end

  private def student_ids_with_completed_activity_sessions_counts
    ActivitySession
      .joins(:classroom_unit)
      .where(activity_sessions: { user_id: student_ids, is_final_score: true })
      .where(classroom_unit: { classroom: classroom, unit: units })
      .group('activity_sessions.user_id')
      .count
  end
end
