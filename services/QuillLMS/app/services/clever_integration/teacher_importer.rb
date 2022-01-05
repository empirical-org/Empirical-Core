# frozen_string_literal: true

module CleverIntegration
  class TeacherImporter < ApplicationService
    attr_reader :data, :clever_id

    def initialize(data)
      @data = data
      @clever_id = data[:clever_id]
    end

    def run
      teacher ? TeacherUpdater.run(teacher, data) : TeacherCreator.run(data)
    end

    private def teacher
      ::User.find_by(clever_id: clever_id)
    end
  end
end
