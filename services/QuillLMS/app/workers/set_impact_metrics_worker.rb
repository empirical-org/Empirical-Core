class SetImpactMetricsWorker
  include Sidekiq::Worker

  ACTIVITY_SESSION_MINIMUM = 9
  FREE_LUNCH_MINIMUM = 39

  def perform
    set_impact_metrics
  end

  def set_impact_metrics
    starter_timestamp = Time.now
    finished_activity_sessions_query = ActivitySession.where(state: 'finished')
    teachers_query = User.select(:id)
      .joins(:units, classroom_units: :activity_sessions)
      .where("activity_sessions.state = 'finished'")
      .group('users.id')
      .having('count(activity_sessions) > ?', ACTIVITY_SESSION_MINIMUM)
    teacher_ids = teachers_query.to_a.map(&:id)
    schools_query = School.joins(:schools_users).where(schools_users: {user_id: teacher_ids}).distinct
    low_income_schools_query = schools_query.where("free_lunches > ?", FREE_LUNCH_MINIMUM)

    number_of_sentences = finished_activity_sessions_query.size.floor(-5) * 10
    $redis.set(PagesController::NUMBER_OF_SENTENCES, number_of_sentences)
    number_of_students = finished_activity_sessions_query.pluck(:user_id).uniq.size.floor(-5)
    $redis.set(PagesController::NUMBER_OF_STUDENTS, number_of_students)
    number_of_teachers = teachers_query.to_a.size.floor(-2)
    $redis.set(PagesController::NUMBER_OF_TEACHERS, number_of_teachers)
    number_of_schools = schools_query.to_a.size
    $redis.set(PagesController::NUMBER_OF_SCHOOLS, number_of_schools)
    number_of_low_income_schools = low_income_schools_query.to_a.size
    $redis.set(PagesController::NUMBER_OF_LOW_INCOME_SCHOOLS, number_of_low_income_schools)
    puts 'TIME ELAPSED'
    puts Time.now - starter_timestamp
  end

end
