# frozen_string_literal: true

class SetImpactMetricsWorker
  include Sidekiq::Worker

  LOW_INCOME_PERCENTAGE = 0.63 # number from PG here: https://www.notion.so/quill/Updates-to-Impact-Page-097eab84d2c84737a7f47bb435ea4890
  SENTENCES_PER_ACTIVITY_SESSION = 10

  def perform
    finished_activity_sessions_count = ImpactMetrics::ActivitiesAllTimeQuery.run[0][:count]
    number_of_sentences = self.class.round_to_hundred_millions(finished_activity_sessions_count * SENTENCES_PER_ACTIVITY_SESSION)
    $redis.set(PagesController::NUMBER_OF_SENTENCES, number_of_sentences)

    active_students_count = ImpactMetrics::ActiveStudentsAllTimeQuery.run[0][:count]
    number_of_students = self.class.round_to_hundred_thousands(active_students_count)
    $redis.set(PagesController::NUMBER_OF_STUDENTS, number_of_students)

    teacher_count = ImpactMetrics::ActiveTeachersAllTimeCountQuery.run[0][:count]
    number_of_teachers = self.class.round_to_thousands(teacher_count)
    $redis.set(PagesController::NUMBER_OF_TEACHERS, number_of_teachers)

    schools = ImpactMetrics::SchoolsWithMinimumActivitySessionsQuery.run
    number_of_schools = self.class.round_to_thousands(schools.length)
    $redis.set(PagesController::NUMBER_OF_SCHOOLS, number_of_schools)

    number_of_low_income_schools = self.class.round_to_thousands(number_of_schools * LOW_INCOME_PERCENTAGE)
    $redis.set(PagesController::NUMBER_OF_LOW_INCOME_SCHOOLS, number_of_low_income_schools)
  end

  def self.round_to_hundred_millions(number)
    number.round(-8)
  end

  def self.round_to_hundred_thousands(number)
    number.round(-5)
  end

  def self.round_to_thousands(number)
    number.round(-3)
  end
end
