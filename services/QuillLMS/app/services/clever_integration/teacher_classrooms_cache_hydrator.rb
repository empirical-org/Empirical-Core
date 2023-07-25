# frozen_string_literal: true

module CleverIntegration
  class TeacherClassroomsCacheHydrator < ApplicationService
    class NilTeacherError < ::CleverIntegration::Error
      MESSAGE = 'Teacher required for clever client access'
    end

    PUSHER_EVENT = "clever-classrooms-retrieved"

    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      raise NilTeacherError if user.nil?

      cache_classrooms_data
      notify_pusher
    rescue => e
      ErrorNotifier.report(e, user_id: user.id)
    end

    private def cache_classrooms_data
      CleverIntegration::TeacherClassroomsCache.write(user.id, data.to_json)
    end

    private def client
      @client ||= ClientFetcher.run(user)
    end

    private def data
      { classrooms: client.get_teacher_classrooms(user.clever_id) }
    end

    private def notify_pusher
      PusherTrigger.run(user.id, PUSHER_EVENT, pusher_message)
    end

    private def pusher_message
      "Clever classrooms cached for #{user.id}."
    end
  end
end
