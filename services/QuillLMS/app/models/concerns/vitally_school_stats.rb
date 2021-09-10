module VitallySchoolStats
  extend ActiveSupport::Concern

  private def active_students_query(school)
    # use raw SQL to bypass scope limits (visible: true) on classrooms
    ActivitySession.select(:user_id)
      .distinct
      .joins("JOIN classroom_units on classroom_units.id=activity_sessions.classroom_unit_id")
      .joins("JOIN classrooms ON classrooms.id=classroom_units.classroom_id")
      .joins("JOIN classrooms_teachers ON classrooms_teachers.classroom_id=classrooms.id")
      .joins("JOIN schools_users ON schools_users.user_id = classrooms_teachers.user_id")
      .joins("JOIN schools ON schools_users.school_id=schools.id")
      .where(state: 'finished').where('schools.id = ?', school.id)
  end

  private def activities_finished_query(school)
    ClassroomsTeacher.joins("JOIN users ON users.id=classrooms_teachers.user_id")
      .joins("JOIN schools_users ON schools_users.user_id=users.id")
      .joins("JOIN schools ON schools.id=schools_users.school_id")
      .joins("JOIN classrooms ON classrooms.id=classrooms_teachers.classroom_id")
      .joins("JOIN classroom_units ON classroom_units.classroom_id=classrooms.id")
      .joins("JOIN activity_sessions ON activity_sessions.classroom_unit_id=classroom_units.id")
      .where('schools.id = ?', school.id)
      .where('activity_sessions.state = ?', 'finished')
  end

  def activities_per_student(active_students, activities_finished)
    if active_students > 0
      (activities_finished.to_f / active_students).round(2)
    else
      0
    end
  end
end
