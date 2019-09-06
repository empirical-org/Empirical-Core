class RetrieveGoogleClassroomsWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'critical'

  SERIALIZED_GOOGLE_CLASSROOMS_CACHE_LIFE = 60*60

  def perform(user_id)
    return unless user_id
    user = User.find(user_id)
    google_response = GoogleIntegration::Classroom::Main.pull_data(user)
    data = google_response === 'UNAUTHENTICATED' ? {errors: google_response} : {classrooms: google_response}
    serialized_data = data.to_json
    $redis.set("#{ClassroomManagerController::SERIALIZED_GOOGLE_CLASSROOMS_FOR_}#{user_id}", serialized_data)
    $redis.expire("#{ClassroomManagerController::SERIALIZED_GOOGLE_CLASSROOMS_FOR_}#{user_id}", SERIALIZED_GOOGLE_CLASSROOMS_CACHE_LIFE)
    PusherTrigger.run(user_id, 'google-classrooms-retrieved', "Google classrooms found for #{user_id}.")
  end
end
