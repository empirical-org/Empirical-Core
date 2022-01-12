# frozen_string_literal: true

module CleverIntegration
  class DistrictTeacherIntegration < ApplicationService
    class NilDistrictError < ::CleverIntegration::Error
      MESSAGE = 'No district was found'
    end

    attr_reader :teacher, :district_id

    def initialize(teacher, district_id)
      @teacher = teacher
      @district_id = district_id
    end

    def run
      import_district
      save_auth_credential
      associate_teacher_to_school
      associate_teacher_to_district
    end

    private def associate_teacher_to_district
      CleverIntegration::Associators::TeacherToDistrict.run(teacher, district)
    end

    private def associate_teacher_to_school
      CleverIntegration::Importers::School.run(teacher, district.token)
    end

    private def district
      @district ||= CleverIntegration::Importers::CleverDistrict.run(district_id: district_id)
    end

    private def import_district
      raise NilDistrictError if district.nil?
    end

    private def save_auth_credential
      AuthCredentialSaver.run(teacher, district.token, ::AuthCredential::CLEVER_DISTRICT_PROVIDER)
    end
  end
end

