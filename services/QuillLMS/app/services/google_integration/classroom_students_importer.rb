# frozen_string_literal: true

module GoogleIntegration
  class ClassroomStudentsImporter < ApplicationService
    attr_reader :classroom_students_data

    delegate :classroom_external_id, to: :classroom_students_data

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
      ::ProviderClassroomUsersUpdater.run(classroom_external_id, user_external_ids, GoogleClassroomUser)
    end

    private def user_external_ids
      classroom_students_data.pluck(:user_external_id)
    end
  end
end

