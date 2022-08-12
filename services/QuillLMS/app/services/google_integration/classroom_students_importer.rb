# frozen_string_literal: true

module GoogleIntegration
  class ClassroomStudentsImporter < ApplicationService
    attr_reader :classroom_students_data

    delegate :google_classroom_id, :google_ids, to: :classroom_students_data

    def initialize(classroom_students_data)
      @classroom_students_data = classroom_students_data
    end

    def run
      import_classroom_students
      update_provider_classroom_users
    end

    private def import_classroom_students
      classroom_students_data.each { |classroom_student_data| ClassroomStudentImporter.run(classroom_student_data) }
    end

    private def update_provider_classroom_users
      ProviderClassroomUsersUpdater.run(google_classroom_id, google_ids, GoogleClassroomUser)
    end
  end
end
