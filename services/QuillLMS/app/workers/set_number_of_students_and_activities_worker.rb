class SetNumberOfStudentsAndActivitiesWorker
  include Sidekiq::Worker

  def perform
    set_number_of_students_and_activities
  end

  def set_number_of_students_and_activities
    activity_sessions = ActivitySession.where(state: 'finished')
    number_of_activities = activity_sessions.count.round(-6)
    $redis.set("NUMBER_OF_ACTIVITIES", number_of_activities)
    number_of_students = User.joins(:activity_sessions).where("activity_sessions.state = 'finished'").group_by("users.id").length
    $redis.set("NUMBER_OF_STUDENTS", number_of_students)
    $redis.set("NUMBER_OF_STUDENTS_AND_ACTIVITIES_LAST_SET", Time.now)
  end

end
