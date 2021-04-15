module CleverIntegration::Parsers::Student

  def self.run(student)
    name_hash = student.name
    name = generate_name(name_hash.first, name_hash.last)
    username = student.credentials ? student.credentials.district_username : nil
    {
      clever_id: student.id,
      email: student.email.try(:downcase),
      username: username,
      name: name
    }
  end

  def self.generate_name(first_name, last_name)
    JoinNames.new(first_name, last_name).call
  end
end
