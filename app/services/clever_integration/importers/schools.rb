module CleverIntegration::Importers::Schools

  def self.run(teachers, district_token, teacher_requester)
    schools = teachers.map do |teacher|
      CleverIntegration::Importers::School.run(teacher, district_token, teacher_requester)
    end
    schools.compact
  end

end
