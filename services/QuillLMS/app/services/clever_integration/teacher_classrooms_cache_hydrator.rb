# frozen_string_literal: true

module CleverIntegration
  class TeacherClassroomsCacheHydrator < ApplicationService
    class NilTeacherError < ::CleverIntegration::Error
      MESSAGE = 'Teacher required for clever client access'
    end

    PUSHER_EVENT = "clever-classrooms-retrieved"

    attr_reader :teacher_id

    def initialize(teacher_id)
      @teacher_id = teacher_id
    end

    def run
      load_teacher
      cache_classrooms_data
      notify_pusher
    rescue StandardError => e
      NewRelic::Agent.notice_error(e, user_id: teacher.id)
    end

    private def cache_classrooms_data
      TeacherClassroomsCache.write(teacher_id, data.to_json)
    end

    private def client
      @client ||= ClientFetcher.run(teacher)
    end

    private def data
      { classrooms: client.get_teacher_classrooms(teacher.clever_id) }
    end

    private def load_teacher
      raise NilTeacherError if teacher.nil?
    end

    private def notify_pusher
      PusherTrigger.run(teacher_id, PUSHER_EVENT, pusher_message)
    end

    private def pusher_message
      "Clever classrooms cached for #{teacher_id}."
    end

    private def teacher
      @teacher ||= ::User.find_by(id: teacher_id)
    end
  end
end
