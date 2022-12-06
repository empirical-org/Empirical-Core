# frozen_string_literal: true

module GoogleIntegration
  class TeacherClassroomsRetriever < ApplicationService
    ACCESS_TOKEN_ERRORS = [
      RefreshAccessToken::RefreshAccessTokenError,
      Client::AccessTokenError
    ].freeze

    PUSHER_EVENT = "google-classrooms-retrieved"
    UNAUTHENTICATED_RESPONSE = 'UNAUTHENTICATED'

    attr_reader :user_id

    def initialize(user_id)
      @user_id = user_id
    end

    def run
      cache_classrooms_data
      notify_pusher
    rescue *ACCESS_TOKEN_ERRORS => e
      ErrorNotifier.report(e, user_id: user_id)
      e.message
    end

    private def cache_classrooms_data
      TeacherClassroomsCache.write(user_id, data.to_json)
    end

    private def data
      unauthenticated_response? ? { errors: google_response } : { classrooms: google_response }
    end

    private def unauthenticated_response?
      google_response == UNAUTHENTICATED_RESPONSE
    end

    private def google_response
      @google_response ||= GoogleIntegration::Classroom::Main.pull_data(user)
    end

    private def notify_pusher
      PusherTrigger.run(user_id, PUSHER_EVENT, "Google classrooms found for #{user_id}.")
    end

    private def user
      ::User.find(user_id)
    end
  end
end
