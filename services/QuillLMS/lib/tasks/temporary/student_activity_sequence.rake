# frozen_string_literal: true

namespace :student_activity_sequence do
  task :backfill_pre_diagnostics => [:environment] do
    include StudentActivitySequenceBackfill

    pre_diagnostic_classroom_units = classroom_units.where.not(units: {activities: {follow_up_activity_id: nil}})

    backfill_classroom_units(pre_diagnostic_classroom_units)
  end

  task :backfill_recommendations => [:environment] do
    include StudentActivitySequenceBackfill

    recommendations_classroom_units = classroom_units.joins(units: {unit_template: :recommendations})

    backfill_classroom_units(recommendations_classroom_units)
  end

  task :backfill_post_diagnostics => [:environment] do
    include StudentActivitySequenceBackfill

    post_diagnostic_activity_ids = Activity.where.not(follow_up_activity_id: nil)
      .pluck(:follow_up_activity_id)
    post_diagnostic_classroom_units = classroom_units.where(units: {activities: {id: post_diagnostic_activity_ids}})

    backfill_classroom_units(pre_diagnostic_classroom_units)
  end

  module StudentActivitySequenceBackfill
    def classroom_units = ClassroomUnit.joins(units: :activities).select(:id)

    def backfill_classroom_units(classroom_units)
      classroom_units.each do |classroom_unit|
        classroom_unit_id = classroom_unit.id
        classroom_unit.assigned_student_ids.each do |student_id|
          StudentActivitySequences::HandleAssignmentWorker.perform_async(classroom_unit_id, student_id, true)
        end
      end
    end
  end
end
