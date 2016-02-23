module CleverIntegration::Importers::Schools

  def self.run(teachers, district_token, teacher_requester)
    schools = teachers.map do |teacher|
      self.import_school(teacher, district_token, teacher_requester)
    end
    schools
  end

  private

  def self.import_school(teacher, district_token, teacher_requester)
    CleverIntegration::Importers::School.run(teacher, district_token, teacher_requester)
  end
end