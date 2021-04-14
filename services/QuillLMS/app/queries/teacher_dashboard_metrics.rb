class TeacherDashboardMetrics

  def self.queries(user)
    today = Date.today
    days_since_last_sunday = today.wday == 0 ? 0 : (today.wday + 6) % 7 + 1
    last_sunday = today - days_since_last_sunday
    july_first_of_this_year = Date.parse("01-07-#{today.year}")
    last_july_first = today.month > 7 ? july_first_of_this_year : july_first_of_this_year - 1.year
    classroom_ids = user.classrooms_i_teach.map(&:id)
    {
      weekly_assigned_activities_count: count_of_assigned_activities(classroom_ids, last_sunday),
      yearly_assigned_activities_count: count_of_assigned_activities(classroom_ids, last_july_first),
      weekly_completed_activities_count: count_of_completed_activities(classroom_ids, last_sunday),
      yearly_completed_activities_count: count_of_completed_activities(classroom_ids, last_july_first)
    }
  end

  def self.count_of_assigned_activities(classroom_ids, start_date)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_ids).where("created_at >= ?", start_date)
    total_count = 0
    classroom_units.each do |cu|
      number_of_students = cu.assigned_student_ids.length
      number_of_activities = UnitActivity.where(unit_id: cu.unit_id).count
      total_count += number_of_students * number_of_activities
    end
    total_count
  end

  def self.count_of_completed_activities(classroom_ids, start_date)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_ids)
    ActivitySession.where(classroom_unit_id: classroom_units.ids).where("completed_at >= ?", start_date).count
  end
end
