# frozen_string_literal: true

module CleverIntegration::Importers::Schools

  def self.run(teachers, district_token)
    schools = teachers.map do |teacher|
      CleverIntegration::Importers::School.run(teacher, district_token)
    end
    schools.compact
  end

end
