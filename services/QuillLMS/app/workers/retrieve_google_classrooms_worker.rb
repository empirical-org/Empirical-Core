class RetrieveGoogleClassroomsWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'critical'

  def perform(user_id)
    if user_id
      serialized_google_classrooms_cache_life = 60*60
      user = User.find(user_id)
      google_response = GoogleIntegration::Classroom::Main.pull_data(user)
      data = google_response === 'UNAUTHENTICATED' ? {errors: google_response} : {classrooms: google_response}
      serialized_data = data.to_json
      $redis.set("SERIALIZED_GOOGLE_CLASSROOMS_FOR_#{user_id}", serialized_data)
      $redis.expire("SERIALIZED_GOOGLE_CLASSROOMS_FOR_#{user_id}", serialized_google_classrooms_cache_life)
      PusherGoogleClassroomsRetrieved.run(user_id)
    end
  end
end
