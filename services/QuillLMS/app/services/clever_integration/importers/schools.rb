module CleverIntegration::Importers::Schools

  def self.run(teachers, district_token, requesters)
    schools = teachers.map do |teacher|
      CleverIntegration::Importers::School.run(teacher, district_token, requesters)
    end
    schools.compact
  end

end
