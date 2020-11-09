class RetrieveGoogleClassroomsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  SERIALIZED_GOOGLE_CLASSROOMS_CACHE_LIFE = 60

  def perform(user_id)
    return unless user_id
    user = User.find(user_id)
    begin
      google_response = GoogleIntegration::Classroom::Main.pull_data(user)
    rescue GoogleIntegration::RefreshAccessToken::RefreshAccessTokenError,
           GoogleIntegration::Client::AccessTokenError => e
      NewRelic::Agent.add_custom_attributes({
        user_id: user_id
      })
      NewRelic::Agent.notice_error(e)
      # If we couldn't get Google sync to work, no reason to do any of
      # the rest of this
      return e.message
    end
    data = google_response === 'UNAUTHENTICATED' ? {errors: google_response} : {classrooms: google_response}
    serialized_data = data.to_json
    PusherTrigger.run(user_id, 'google-classrooms-retrieved', "Google classrooms found for #{user_id}.")
  end
end
