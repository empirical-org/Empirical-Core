# frozen_string_literal: true

class CacheSegmentSchoolData
  CACHED_SCHOOL_DATA = 'CACHED_SCHOOL_DATA'

  TOTAL_TEACHERS_AT_SCHOOL = 'TOTAL_TEACHERS_AT_SCHOOL',
  TOTAL_STUDENTS_AT_SCHOOL = 'TOTAL_STUDENTS_AT_SCHOOL',
  TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL = 'TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL',
  ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR = 'ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR',
  ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR = 'ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR',
  TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR = 'TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR'

  CACHE_LIFE = 60*60*25

  def initialize(school)
    @school = school
  end

  def read
    Rails.cache.read(@school.id, namespace: CACHED_SCHOOL_DATA)
  end

  def write(data)
    Rails.cache.write(@school.id, data, namespace: CACHED_SCHOOL_DATA, expires_in: CACHE_LIFE)
  end

  def calculate_and_set_cache
    hash = {
      [TOTAL_TEACHERS_AT_SCHOOL] => teachers_at_school.count,
      [TOTAL_STUDENTS_AT_SCHOOL] => students_at_school.count,
      [TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL] => activities_completed_by_students_at_school.count,
      [ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR] => active_teachers_at_school_this_year.count,
      [ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR] => active_students_at_school_this_year.count,
      [TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR] => activities_completed_by_students_at_school_this_year.count
    }
    write(hash)
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
