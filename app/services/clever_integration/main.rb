module CleverIntegration::Main

  def self.run(auth_hash)
    result = send(auth_hash[:info][:user_type], auth_hash)
    result
  end

  private

  def self.district(auth_hash)
    result = CleverIntegration::SignUp::District.run(auth_hash)
    result
  end

  def self.teacher(auth_hash)
    result = CleverIntegration::SignUp::Teacher.run(auth_hash)
    result
  end

  def self.student(auth_hash)
    result = CleverIntegration::SignUp::Student.run(auth_hash)
    result
  end
end