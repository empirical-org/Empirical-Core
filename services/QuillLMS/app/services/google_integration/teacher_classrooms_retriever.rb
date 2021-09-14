module GoogleIntegration
  class TeacherClassroomsRetriever
    ACCESS_TOKEN_ERRORS = [
      RefreshAccessToken::RefreshAccessTokenError,
      Client::AccessTokenError
    ].freeze

    UNAUTHENTICATED_RESPONSE = 'UNAUTHENTICATED'.freeze

    attr_reader :user_id

    def initialize(user_id)
      @user_id = user_id
    end

    def run
      cache_classrooms_data
      set_cache_expiration
      notify_pusher
    rescue *ACCESS_TOKEN_ERRORS => e
      NewRelic::Agent.add_custom_attributes({user_id: user_id})
      NewRelic::Agent.notice_error(e)
      e.message
    end

    private def cache_classrooms_data
      TeacherClassroomsCache.set(user_id, data.to_json)
    end

    private def data
      unauthenticated_response? ? { errors: google_response } : { classrooms: google_response }
    end

    private def unauthenticated_response?
      google_response == UNAUTHENTICATED_RESPONSE
    end

    private def google_response
      @google_response ||= Classroom::Main.pull_data(user)
    end

    private def notify_pusher
      PusherTrigger.run(user_id, 'google-classrooms-retrieved', "Google classrooms found for #{user_id}.")
    end

    private def set_cache_expiration
      TeacherClassroomsCache.expire(user_id)
    end

    private def user
      ::User.find(user_id)
    end
  end
end
