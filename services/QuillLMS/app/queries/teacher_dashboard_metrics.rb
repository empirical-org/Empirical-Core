# frozen_string_literal: true

class TeacherDashboardMetrics

  def initialize(user)
    @user = user
  end

  def run
    {
       weekly_assigned_activities_count: count_of_assigned_activities(last_sunday),
       yearly_assigned_activities_count: count_of_assigned_activities(last_july_first),
       weekly_completed_activities_count: completed_at_array.count {|date| date >= last_sunday},
       yearly_completed_activities_count: completed_at_array.count {|date| date >= last_july_first}
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

  private def today
    @today ||= Date.current
  end

  private def days_since_last_sunday
    @days_since_last_sunday ||= today.wday == 0 ? 0 : ((today.wday + 6) % 7) + 1
  end

  private def last_sunday
    @last_sunday ||= today - days_since_last_sunday
  end

  private def july_first_of_this_year
    @july_first_of_this_year ||= Date.parse("01-07-#{today.year}")
  end

  private def last_july_first
    @last_july_first ||= today.month > 7 ? july_first_of_this_year : july_first_of_this_year - 1.year
  end

end
