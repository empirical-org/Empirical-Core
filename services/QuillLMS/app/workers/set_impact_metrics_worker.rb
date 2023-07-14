# frozen_string_literal: true

class SetImpactMetricsWorker
  include Sidekiq::Worker

  FREE_LUNCH_MINIMUM = 39
  SENTENCES_PER_ACTIVITY_SESSION = 10

  def perform
    set_impact_metrics
  end

  def set_impact_metrics
    finished_activity_sessions = ImpactMetrics::ActivitiesAllTimeQuery.run

    teachers = ImpactMetrics::ActiveTeachersAllTimeQuery.run
    teacher_ids = teachers.to_a.map {|teacher| teacher["id"]}

    schools = ImpactMetrics::SchoolsContainingCertainTeachersQuery.run(teacher_ids)
    low_income_schools = schools.select { |school| school["free_lunches"].present? && school["free_lunches"] > FREE_LUNCH_MINIMUM}

    number_of_sentences = self.class.round_to_ten_thousands(finished_activity_sessions.length) * SENTENCES_PER_ACTIVITY_SESSION
    $redis.set(PagesController::NUMBER_OF_SENTENCES, number_of_sentences)
    number_of_students = self.class.round_to_ten_thousands(finished_activity_sessions.count("DISTINCT(user_id)"))
    $redis.set(PagesController::NUMBER_OF_STUDENTS, number_of_students)
    number_of_teachers = self.class.round_to_hundreds(teacher_ids.size)
    $redis.set(PagesController::NUMBER_OF_TEACHERS, number_of_teachers)
    number_of_schools = schools.length
    $redis.set(PagesController::NUMBER_OF_SCHOOLS, number_of_schools)
    number_of_low_income_schools = low_income_schools.length
    $redis.set(PagesController::NUMBER_OF_LOW_INCOME_SCHOOLS, number_of_low_income_schools)
  end

  def self.round_to_ten_thousands(number)
    number.floor(-5)
  end

  def self.round_to_hundreds(number)
    number.floor(-2)
  end
end
