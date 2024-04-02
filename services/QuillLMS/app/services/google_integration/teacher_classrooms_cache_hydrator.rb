# frozen_string_literal: true

module GoogleIntegration
  class TeacherClassroomsCacheHydrator < ApplicationService
    PUSHER_EVENT = 'google-classrooms-retrieved'

    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      cache_classrooms_data
      notify_pusher
    rescue => e
      ErrorNotifier.report(e, user_id: user.id)
    end

    private def cache_classrooms_data
      TeacherClassroomsCache.write(user.id, serialized_teacher_classrooms)
    end

    private def client
      ClientFetcher.run(user)
    end

    private def notify_pusher
      PusherTrigger.run(user.id, PUSHER_EVENT, pusher_message)
    end

    private def pusher_message
      "Google classrooms cached for #{user.id}."
    end

    private def serialized_teacher_classrooms
      client
        .teacher_classrooms
        .to_json
    end
  end
end
