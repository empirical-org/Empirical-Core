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

    initialized_counts.merge(student_ids_with_completed_activity_sessions_counts)
  end

  private def initialized_counts
    student_ids
      .map { |student_id| [student_id, 0] }
      .to_h
  end

  private def student_ids_with_completed_activity_sessions_counts
    ActivitySession
      .joins(:classroom_unit)
      .where(activity_sessions: { user_id: student_ids, state: ActivitySession::STATE_FINISHED })
      .where(classroom_unit: { classroom: classroom, unit: units })
      .group('activity_sessions.user_id')
      .count
  end
end
