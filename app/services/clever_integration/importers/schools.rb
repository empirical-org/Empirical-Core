module CleverIntegration::Importers::Schools

  def self.run(teachers, district_token)
    schools = teachers.map do |teacher|
      self.import_school(teacher, district_token)
    end
    schools
  end

  private

  def self.import_school(teacher, district_token)
    CleverIntegration::Importers::School.run(teacher, district_token)
  end
end