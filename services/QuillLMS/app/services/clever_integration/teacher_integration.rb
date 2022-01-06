# frozen_string_literal: true

module CleverIntegration
  class TeacherIntegration < ApplicationService
    class NilTeacherError < ::CleverIntegration::Error
      MESSAGE = 'No Teacher Present'
    end

    attr_reader :auth_hash, :info_hash, :district_id

    def initialize(auth_hash)
      @auth_hash = auth_hash
      @info_hash = auth_hash.info
      @district_id = info_hash.district_id
    end

    def run
      import_teacher
      run_teacher_integration
      retrieve_teacher_classrooms
      update_existing_teacher_classrooms
      { type: 'user_success', data: teacher }
    rescue StandardError => e
      NewRelic::Agent.notice_error(e, teacher_clever_id: info_hash.id)
      { type: 'user_failure', data: 'Error: ' + e.message }
    end

    private def district_teacher_integration
      DistrictTeacherIntegration.run(teacher, district_id)
    end

    private def library_teacher_integration
      LibraryTeacherIntegration.run(teacher, auth_hash.credentials.token)
    end

    private def import_teacher
      raise NilTeacherError if teacher.nil?
    end

    private def retrieve_teacher_classrooms
      TeacherClassroomsRetriever.run(teacher.id)
    end

    private def run_teacher_integration
      district_id ? district_teacher_integration : library_teacher_integration
    end

    private def teacher
      @teacher ||= TeacherImporter.run(teacher_data)
    end

    private def teacher_data
      TeacherDataParser.run(info_hash)
    end

    private def update_existing_teacher_classrooms
      TeacherImportedClassroomsUpdater.run(teacher.id)
    end
  end
end
