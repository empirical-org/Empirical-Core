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
        SELECT DISTINCT schools.city, schools.state, COUNT(DISTINCT(student_ids.user_id)) AS number_of_students
        FROM schools
        JOIN schools_users ON schools.id = schools_users.id
        JOIN users ON schools_users.user_id = users.id
        JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
        JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id
        JOIN students_classrooms ON students_classrooms.classroom_id = classrooms.id
        JOIN (
        SELECT DISTINCT(activity_sessions.user_id) FROM activity_sessions WHERE activity_sessions.state = 'finished'
        ) AS student_ids ON student_ids.user_id = students_classrooms.student_id
        WHERE schools.city != ''
        GROUP BY schools.city, schools.state
        HAVING COUNT(DISTINCT(student_ids.user_id)) >= 100
        ORDER BY number_of_students DESC, schools.city, schools.state
      ) AS school_cities
    ")
    number_of_sentences = activity_sessions_query.to_a[0]['number_of_activities'].to_i.floor(-5) * 10
    $redis.set("NUMBER_OF_SENTENCES", number_of_sentences)
    number_of_students = activity_sessions_query.to_a[0]['number_of_students'].to_i.floor(-5)
    $redis.set("NUMBER_OF_STUDENTS", number_of_students)
    number_of_cities = cities_query.to_a[0]['count'].to_i.floor(-2)
    $redis.set("NUMBER_OF_CITIES", number_of_cities)
    $redis.set("NUMBER_OF_STUDENTS_SENTENCES_AND_CITIES_LAST_SET", Time.now)
  end

end
