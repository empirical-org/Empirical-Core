module CleverIntegration::Importers::Classrooms

  def self.run(teacher, district_token)

  end

  private

  def self.teacher_requester
    lambda do |clever_id, district_token|
      Clever::Teacher.retrieve(clever_id, district_token)
    end
  end
end