module CleverIntegration::Parsers::TeacherFromAuth

  def self.run(auth_hash)
    info = auth_hash[:info]
    CleverIntegration::Parsers::Teacher.run(info)
  end
end