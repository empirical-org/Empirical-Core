class SetNumberOfStudentsAndActivitiesWorker
  include Sidekiq::Worker

  def perform
    set_number_of_students_and_activities
  end

  def set_number_of_students_and_activities
    query = ActiveRecord::Base.connection.execute("SELECT COUNT(DISTINCT user_id) AS number_of_students, COUNT(DISTINCT activity_sessions.id) AS number_of_activities FROM activity_sessions WHERE activity_sessions.state = 'finished'")
    number_of_activities = query.to_a[0]['number_of_activities'].to_i.round(-6)
    $redis.set("NUMBER_OF_ACTIVITIES", number_of_activities)
    number_of_students = query.to_a[0]['number_of_students'].to_i.round(-3)
    $redis.set("NUMBER_OF_STUDENTS", number_of_students)
    $redis.set("NUMBER_OF_STUDENTS_AND_ACTIVITIES_LAST_SET", Time.now)
  end

end
