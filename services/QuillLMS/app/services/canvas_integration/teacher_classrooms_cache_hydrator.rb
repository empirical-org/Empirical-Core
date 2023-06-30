# frozen_string_literal: true

module CanvasIntegration
  class TeacherClassroomsCacheHydrator < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      cache_classrooms_data
    rescue => e
      ErrorNotifier.report(e, user_id: user.id)
    end

    private def cache_classrooms_data
      CanvasIntegration::TeacherClassroomsCache.write(user.id, serialized_teacher_classrooms)
    end

    private def client
      ClientFetcher.run(user)
    end

    private def serialized_teacher_classrooms
      client
        .teacher_classrooms
        .to_json
    end
  end
end
