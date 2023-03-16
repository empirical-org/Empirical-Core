# frozen_string_literal: true

class CacheSegmentSchoolData
  CACHE_KEYS = [
    TOTAL_TEACHERS_AT_SCHOOL = 'TOTAL_TEACHERS_AT_SCHOOL',
    TOTAL_STUDENTS_AT_SCHOOL = 'TOTAL_STUDENTS_AT_SCHOOL',
    TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL = 'TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL',
    ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR = 'ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR',
    ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR = 'ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR',
    TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR = 'TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR'
  ]

  CACHE_LIFE = 60*60*25

  def initialize(school)
    @school = school
  end

  def read(namespace)
    Rails.cache.read(@school.id, namespace: namespace)
  end

  def delete(namespace)
    Rails.cache.delete(@school.id, namespace: namespace)
  end

  def write(data, namespace, expires_in=CACHE_LIFE)
    Rails.cache.write(@school.id, data, expires_in: expires_in, namespace: namespace)
  end

  def set_all_fields
    set_total_teachers_at_school
    set_total_students_at_school
    set_total_activities_completed_by_students_at_school
    set_active_teachers_at_school_this_year
    set_active_students_at_school_this_year
    set_total_activities_completed_by_students_at_school_this_year
  end

  def set_total_teachers_at_school
    write(teachers_at_school.count, TOTAL_TEACHERS_AT_SCHOOL)
  end

  def set_total_students_at_school
    write(students_at_school.count, TOTAL_STUDENTS_AT_SCHOOL)
  end

  def set_total_activities_completed_by_students_at_school
    write(activities_completed_by_students_at_school.count, TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL)
  end

  def set_active_teachers_at_school_this_year
    write(active_teachers_at_school_this_year.count, ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR)
  end

  def set_active_students_at_school_this_year
    write(active_students_at_school_this_year.count, ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR)
  end

  def set_total_activities_completed_by_students_at_school_this_year
    write(activities_completed_by_students_at_school_this_year.count, TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR)
  end

  def active_teachers_at_school_this_year
    teachers_at_school
      .where("last_sign_in > ?", School.school_year_start(Time.current))
  end

  def active_students_at_school_this_year
    students_at_school
      .where("last_sign_in > ?", School.school_year_start(Time.current))
  end

  def activities_completed_by_students_at_school_this_year
    activities_completed_by_students_at_school
      .where("completed_at > ?", School.school_year_start(Time.current))
  end

  def activities_completed_by_students_at_school
    @activities_completed_by_students_at_school ||= ActivitySession
      .completed
      .where(user_id: students_at_school.ids)
  end

  def students_at_school
    @students_at_school ||= User
      .joins(:students_classrooms)
      .where(:students_classrooms => { classroom_id: classrooms_at_school.ids })
  end

  def classrooms_at_school
    @classrooms_at_school ||= Classroom
      .joins(:classrooms_teachers)
      .where(:classrooms_teachers => { user_id: teachers_at_school.ids })
  end

  def teachers_at_school
    @teachers_at_school ||= @school.users
  end

end
