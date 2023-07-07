# frozen_string_literal: true

class SetImpactMetricsWorker
  include Sidekiq::Worker

  FREE_LUNCH_MINIMUM = 39

  def perform
    set_impact_metrics
  end

  def set_impact_metrics
    finished_activity_sessions_query = QuillBigQuery::ActivitiesAllTimeQuery.run

    teachers_query = QuillBigQuery::ActiveTeachersAllTimeQuery.run
    teacher_ids = teachers_query.to_a.map {|teacher| teacher["id"]}

    schools_query = QuillBigQuery::SchoolsContainingCertainTeachersQuery.run({teacher_ids: teacher_ids})
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
