module CleverIntegration::Parsers::Student

  def self.run(student)
    name_hash = student.name
    name = generate_name(name_hash.first, name_hash.last)
    username = student.credentials ? student.credentials.district_username.downcase : nil
    username = username.split('@').first if username =~ ::User::VALID_EMAIL_REGEX
    email = ::User.valid_email?(student.email) ? student.email.downcase : nil
    {
      clever_id: student.id,
      email: email,
      username: username,
      name: name
    }
  end

  def self.generate_name(first_name, last_name)
    JoinNames.new(first_name, last_name).call
  end
end
