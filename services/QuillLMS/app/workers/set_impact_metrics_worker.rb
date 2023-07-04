# frozen_string_literal: true

class SetImpactMetricsWorker
  include Sidekiq::Worker

  ACTIVITY_SESSION_MINIMUM = 9
  FREE_LUNCH_MINIMUM = 39

  def perform
    set_impact_metrics
  end

  def set_impact_metrics
    finished_activity_sessions_query = QuillBigQuery::Runner.execute(
      <<-SQL
        SELECT activity_sessions.id
        FROM lms.activity_sessions
        WHERE state = 'finished'
      SQL
    )

    teachers_query = QuillBigQuery::Runner.execute(
      <<-SQL
        SELECT users.id
        FROM lms.users
        JOIN lms.units on units.user_id = users.id
        JOIN lms.classroom_units ON classroom_units.unit_id = units.id
        JOIN lms.activity_sessions ON activity_sessions.classroom_unit_id = classroom_units.id
        GROUP BY users.id
        HAVING count(activity_sessions) > #{ACTIVITY_SESSION_MINIMUM}
      SQL
    )
    teacher_ids = teachers_query.to_a.map {|teacher| teacher["id"]}

    schools_sql_text = <<-SQL
      SELECT DISTINCT schools.id, schools.free_lunches
      FROM lms.schools
      JOIN lms.schools_users ON schools.id = schools_users.school_id
      WHERE schools_users.user_id IN UNNEST(@teacher_ids)
    SQL
    schools_query = QuillBigQuery::Runner.get_response(schools_sql_text, {teacher_ids: teacher_ids})
    low_income_schools_query = schools_query.select { |school| school["free_lunches"].present? && school["free_lunches"] > FREE_LUNCH_MINIMUM}

    number_of_sentences = finished_activity_sessions_query.count.floor(-5) * 10
    $redis.set(PagesController::NUMBER_OF_SENTENCES, number_of_sentences)
    number_of_students = finished_activity_sessions_query.count("DISTINCT(user_id)").floor(-5)
    $redis.set(PagesController::NUMBER_OF_STUDENTS, number_of_students)
    number_of_teachers = teacher_ids.size.floor(-2)
    $redis.set(PagesController::NUMBER_OF_TEACHERS, number_of_teachers)
    number_of_schools = schools_query.size
    $redis.set(PagesController::NUMBER_OF_SCHOOLS, number_of_schools)
    number_of_low_income_schools = low_income_schools_query.size
    $redis.set(PagesController::NUMBER_OF_LOW_INCOME_SCHOOLS, number_of_low_income_schools)
  end

end
