# frozen_string_literal: true

module GoogleIntegration
  class StudentImportedClassroomsUpdater < ApplicationService
    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      imported_classrooms.each { |classroom| ::Associators::StudentsToClassrooms.run(user, classroom) }
    end

    private def client
      ClientFetcher.run(user)
    end

    private def external_classroom_ids
      client.student_classrooms.pluck(:external_classroom_id)
    end

    private def imported_classrooms
      Classroom.where(google_classroom_id: external_classroom_ids)
    end
  end
end
