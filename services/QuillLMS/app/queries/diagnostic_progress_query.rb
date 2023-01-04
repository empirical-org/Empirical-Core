# frozen_string_literal: true

class DiagnosticProgressQuery
  def self.call(classroom, student_ids, units)
    ActivitySession
      .joins(:classroom_unit)
      .where(activity_sessions: { user_id: student_ids, state: ActivitySession::STATE_FINISHED })
      .where(classroom_unit: { classroom: classroom, unit: units })
      .group('activity_sessions.user_id')
      .count
  end
end
