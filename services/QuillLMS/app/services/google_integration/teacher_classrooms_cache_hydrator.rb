# frozen_string_literal: true

module GoogleIntegration
  class TeacherClassroomsCacheHydrator < ApplicationService
    ACCESS_TOKEN_ERRORS = [
      RefreshAccessToken::RefreshAccessTokenError,
      Client::AccessTokenError
    ].freeze

    PUSHER_EVENT = 'google-classrooms-retrieved'
    UNAUTHENTICATED_RESPONSE = 'UNAUTHENTICATED'

    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      cache_classrooms_data
      notify_pusher
    rescue *ACCESS_TOKEN_ERRORS => e
      ErrorNotifier.report(e, user_id: user.id)
      e.message
    end

    private def cache_classrooms_data
      GoogleIntegration::TeacherClassroomsCache.write(user.id, data.to_json)
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
      PusherTrigger.run(user.id, PUSHER_EVENT, "Google classrooms found for #{user.id}.")
    end
  end
end
