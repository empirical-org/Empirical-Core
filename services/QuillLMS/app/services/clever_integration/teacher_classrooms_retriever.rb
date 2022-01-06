# frozen_string_literal: true

module CleverIntegration
  class TeacherClassroomsRetriever < ApplicationService
    class NilTeacherError < ::CleverIntegration::Error
      MESSAGE = 'Teacher required for clever client access'
    end

    PUSHER_EVENT_CHANNEL = "clever-classrooms-retrieved"

    attr_reader :teacher_id

    def initialize(teacher_id)
      @teacher_id = teacher_id
    end

    def run
      load_teacher
      cache_classrooms_data
      set_cache_expiration
      notify_pusher
    rescue StandardError => e
      NewRelic::Agent.notice_error(e)
    end

    private def cache_classrooms_data
      TeacherClassroomsCache.set(teacher_id, data.to_json)
    end

    private def client
      ClientFetcher.run(teacher)
    end

    private def data
      { classrooms: client.get_sections_for_teacher(teacher.clever_id) }
    end

    private def load_teacher
      raise NilTeacherError if teacher.nil?
    end

    private def notify_pusher
      PusherTrigger.run(teacher_id, PUSHER_EVENT_CHANNEL, pusher_message)
    end

    private def pusher_message
      "Clever classrooms cached for #{teacher_id}."
    end

    private def set_cache_expiration
      TeacherClassroomsCache.expire(teacher_id)
    end

    private def teacher
      @teacher ||= ::User.find_by(id: teacher_id)
    end
  end
end
