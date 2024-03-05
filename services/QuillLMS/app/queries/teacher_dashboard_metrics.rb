# frozen_string_literal: true

class TeacherDashboardMetrics
  include DashboardMetrics

  def initialize(user)
    @user = user
  end

  def run
    {
       weekly_assigned_activities_count: count_of_assigned_activities(last_sunday),
       yearly_assigned_activities_count: count_of_assigned_activities(school_year_start),
       weekly_completed_activities_count: completed_at_array.count {|date| date >= last_sunday},
       yearly_completed_activities_count: completed_at_array.count {|date| date >= school_year_start}
     }
  end

  def count_of_assigned_activities(start_date)
    classroom_units = ClassroomUnit
      .where(classroom_id: classroom_ids)
      .where("created_at >= ?", start_date)

    activity_counts_by_unit = UnitActivity
      .where(unit_id: classroom_units.map(&:unit_id))
      .group(:unit_id)
      .count

    classroom_units.reduce(0) do |total_count, classroom_unit|
      number_of_students = classroom_unit.assigned_student_ids.length
      number_of_activities = activity_counts_by_unit[classroom_unit.unit_id] || 0
      total_count += number_of_students * number_of_activities
    end
  end

  def completed_at_array
    @completed_at_array ||= begin
      classroom_unit_ids = ClassroomUnit.where(classroom_id: classroom_ids).pluck(:id)

      ActivitySession
        .unscoped
        .where(classroom_unit_id: classroom_unit_ids)
        .where.not(completed_at: nil)
        .pluck(:completed_at)
    end
  end

  private def classroom_ids
    @classroom_ids ||= @user.classrooms_i_teach.map(&:id)
  end

end
