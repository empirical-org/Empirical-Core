class TeacherDashboardMetrics

  def initialize(user)
    @user = user
  end

  def run
   {
      weekly_assigned_activities_count: count_of_assigned_activities(last_sunday),
      yearly_assigned_activities_count: count_of_assigned_activities(last_july_first),
      weekly_completed_activities_count: count_of_completed_activities(last_sunday),
      yearly_completed_activities_count: count_of_completed_activities(last_july_first)
    }
  end

  def count_of_assigned_activities(start_date)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_ids).where("created_at >= ?", start_date)
    classroom_units.reduce(0) do |total_count, classroom_unit|
      number_of_students = classroom_unit.assigned_student_ids.length
      number_of_activities = UnitActivity.where(unit_id: classroom_unit.unit_id).count
      total_count += number_of_students * number_of_activities
    end
  end

  def count_of_completed_activities(start_date)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_ids)
    ActivitySession.where(classroom_unit_id: classroom_units.ids).where("completed_at >= ?", start_date).count
  end

  private def classroom_ids
    @classroom_ids ||= @user.classrooms_i_teach.map(&:id)
  end

  private def today
    @today ||= Date.today
  end

  private def days_since_last_sunday
    @days_since_last_sunday ||= today.wday == 0 ? 0 : (today.wday + 6) % 7 + 1
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
