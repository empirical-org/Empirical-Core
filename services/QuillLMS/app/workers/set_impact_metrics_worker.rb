class SetImpactMetricsWorker
  include Sidekiq::Worker

  def perform
    set_impact_metrics
  end

  def set_impact_metrics
    activity_sessions_query = ActiveRecord::Base.connection.execute("
      SELECT
        COUNT(DISTINCT user_id) AS number_of_students,
        COUNT(DISTINCT activity_sessions.id) AS number_of_activities
      FROM activity_sessions
      WHERE activity_sessions.state = 'finished'
    ")
    teachers_query = User.select(:id).joins(:units).joins(:classroom_units).joins(:activity_sessions).where("activity_sessions.state = 'finished'").group('users.id').having('count(activity_sessions) > 9')
    schools_query = School.joins(:schools_users).joins(:users).where("users.id IN (?)", teachers_query.to_a.map(&:id)).distinct
    low_income_schools_query = schools_query.where("free_lunches > 39")

    number_of_sentences = activity_sessions_query.to_a[0]['number_of_activities'].to_i.floor(-5) * 10
    $redis.set(PagesController::NUMBER_OF_SENTENCES, number_of_sentences)
    number_of_students = activity_sessions_query.to_a[0]['number_of_students'].to_i.floor(-5)
    $redis.set(PagesController::NUMBER_OF_STUDENTS, number_of_students)
    number_of_teachers = teachers_query.to_a.length.floor(-2)
    $redis.set(PagesController::NUMBER_OF_TEACHERS, number_of_teachers)
    number_of_schools = schools_query.to_a.length
    $redis.set(PagesController::NUMBER_OF_SCHOOLS, number_of_schools)
    number_of_low_income_schools = low_income_schools_query.to_a.length
    $redis.set(PagesController::NUMBER_OF_LOW_INCOME_SCHOOLS, number_of_low_income_schools)
    $redis.set(PagesController::IMPACT_METRICS_LAST_SET, Time.now)
  end

end
