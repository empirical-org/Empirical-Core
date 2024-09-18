# frozen_string_literal: true

namespace :student_activity_sequence do
  task :backfill_pre_diagnostic_assignment => [:environment] do
    include StudentActivitySequenceBackfill

    pre_diagnostic_classroom_units = classroom_units.where.not(units: {activities: {follow_up_activity_id: nil}})

    backfill_classroom_units(pre_diagnostic_classroom_units)
  end

  task :backfill_recommendation_assignment => [:environment] do
    include StudentActivitySequenceBackfill

    recommendations_classroom_units = classroom_units.joins(units: {unit_template: :recommendations})

    backfill_classroom_units(recommendations_classroom_units)
  end

  task :backfill_post_diagnostic_assignment => [:environment] do
    include StudentActivitySequenceBackfill

    post_diagnostic_classroom_units = classroom_units.where(units: {activities: {id: post_diagnostic_activity_ids}})

    backfill_classroom_units(pre_diagnostic_classroom_units)
  end

  task :backfill_pre_diagnostic_completion=> [:environment] do
    include StudentActivitySequenceBackfill

    post_diagnostic_classroom_units = classroom_units.where(units: {activities: {id: post_diagnostic_activity_ids}})

    backfill_classroom_units(pre_diagnostic_classroom_units)
  end

  module StudentActivitySequenceBackfill
    def activities = Activity.where(id: [pre_diagnostic_activity_ids] + [post_diagnostic_activity_ids] + [recommendation_activity_ids])
    def classroom_units = ClassroomUnit.joins(units: :activities).select(:id)
    def pre_diagnostics = Activity.where.not(follow_up_activity_id: nil)
    def pre_diagnostic_activity_ids = pre_diagnostics.pluck(:id)
    def post_diagnostic_activity_ids = pre_diagnostics.pluck(:follow_up_activity_id)

    def backfill_activity_sessions(activity_sessions)
      activity_sessions.each do |activity_session|
        StudentActivitySequences::HandleCompletionWorker.perform_async(activity_session.id)
      end
    end

    def backfill_classroom_units(classroom_units)
      classroom_units.each do |classroom_unit|
        classroom_unit_id = classroom_unit.id
        classroom_unit.assigned_student_ids.each do |student_id|
          StudentActivitySequences::HandleAssignmentWorker.perform_async(classroom_unit_id, student_id, true)
        end
      end
    end

    def recommendation_activity_ids
      Activity.joins(unit_templates: :recommendations)
        .where(unit_templates: {recommendations: {activity_id: pre_diagnostic_activity_ids}})
        .pluck(:id)
    end
  end
end
