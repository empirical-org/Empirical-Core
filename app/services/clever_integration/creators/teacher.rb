module CleverIntegration::Creators::Teacher

  def self.run(hash)
    teacher = User.find_or_initialize_by(email: hash[:email])
    teacher.update(
      clever_id: hash[:clever_id],
      name: hash[:name],
      token: hash[:token],
      role: 'teacher'
    )
  end
end