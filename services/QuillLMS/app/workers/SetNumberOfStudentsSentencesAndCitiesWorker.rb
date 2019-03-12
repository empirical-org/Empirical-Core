class SetNumberOfStudentsSentencesAndCitiesWorker
  include Sidekiq::Worker

  def perform
    set_number_of_students_sentences_and_cities_worker
  end

  def set_number_of_students_sentences_and_cities_worker
    activity_sessions_query = ActiveRecord::Base.connection.execute("
      SELECT
        COUNT(DISTINCT user_id) AS number_of_students,
        COUNT(DISTINCT activity_sessions.id) AS number_of_activities
      FROM activity_sessions
      WHERE activity_sessions.state = 'finished'
    ")
    cities_query = ActiveRecord::Base.connection.execute("
      SELECT COUNT(*) FROM (
        SELECT
          DISTINCT schools.city, schools.state, schools.mail_city, schools.mail_state
        FROM schools
        JOIN schools_users ON schools.id = schools_users.id
        ) AS school_cities
      ")
    number_of_sentences = activity_sessions_query.to_a[0]['number_of_activities'].to_i.floor(-5) * 10
    $redis.set("NUMBER_OF_SENTENCES", number_of_sentences)
    number_of_students = activity_sessions_query.to_a[0]['number_of_students'].to_i.floor(-5)
    $redis.set("NUMBER_OF_STUDENTS", number_of_students)
    number_of_cities = cities_query.to_a[0]['count'].to_i.floor(-3)
    $redis.set("NUMBER_OF_CITIES", number_of_cities)
    $redis.set("NUMBER_OF_STUDENTS_SENTENCES_AND_CITIES_LAST_SET", Time.now)
  end

end
