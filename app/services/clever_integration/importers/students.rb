module CleverIntegration::Importers::Students

  def self.run(classrooms, district_token)
    CleverIntegration::Importers::Helpers::Students.run(classrooms, district_token, self.section_requester)
  end

  private

  def self.section_requester
    lambda do |clever_id, district_token|
      Clever::Section.retrieve(clever_id, district_token)
    end
  end

end