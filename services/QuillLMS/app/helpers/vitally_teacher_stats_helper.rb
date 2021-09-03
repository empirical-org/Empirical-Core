module VitallyTeacherStatsHelper
  DIAGNOSTIC_ID = 4

  def total_students_in_year(user, school_year_start, school_year_end)
    all_classrooms = user.classrooms_i_teach + user.archived_classrooms
    year_classrooms = all_classrooms.select { |c| school_year_start <= c.created_at && school_year_end > c.created_at }
    year_classrooms.sum { |c| c.students.count}
  end

  def active_students_query(user)
    @active_students ||= ActivitySession.select(:user_id).distinct
    .joins("JOIN classroom_units on classroom_units.id = activity_sessions.classroom_unit_id")
    .joins("JOIN classrooms_teachers on classrooms_teachers.classroom_id=classroom_units.classroom_id")
    .where(state: 'finished')
    .where('classrooms_teachers.user_id = ?', user.id)
  end

  def activities_assigned_in_year_count(user, school_year_start, school_year_end)
    sum_students(in_school_year(activities_assigned_query(user), school_year_start, school_year_end))
  end

  def sum_students(records)
    records.map { |r| r&.assigned_student_ids&.count || 0 }.sum || 0
  end

  def in_school_year(records, school_year_start, school_year_end)
    records.select {|r| r.created_at >= school_year_start && r.created_at < school_year_end }
  end

  def activities_assigned_query(user)
    @activities_assigned ||= user.assigned_students_per_activity_assigned
  end

  def activities_finished_query(user)
    @activities_finished ||= ClassroomsTeacher.where(user_id: user.id)
    .joins("JOIN classrooms ON classrooms.id=classrooms_teachers.classroom_id")
    .joins("JOIN classroom_units ON classroom_units.classroom_id = classrooms.id")
    .joins("JOIN activity_sessions ON activity_sessions.classroom_unit_id = classroom_units.id")
    .joins("JOIN activities ON activities.id=activity_sessions.activity_id")
    .where("activity_sessions.state='finished'")
  end

  def activities_per_student(active_students, activities_finished)
    if active_students > 0
      (activities_finished.to_f / active_students).round(2)
    else
      0
    end
  end

  def diagnostics_assigned_in_year_count(user, school_year_start, school_year_end)
    sum_students(filter_diagnostics(in_school_year(activities_assigned_query(user), school_year_start, school_year_end)))
  end

  def filter_diagnostics(records)
    records.select {|r| Activity.find(r.id).is_diagnostic? }
  end

  def diagnostics_finished(user)
    activities_finished_query(user).where("activities.activity_classification_id=?", DIAGNOSTIC_ID)
  end
end
