module CleverIntegration::Creators::Teacher

  def self.run(hash)
    teacher = User.find_or_initialize_by(email: hash[:email])
    teacher.update(
      # necessary to have both due to difference in structure between Clever Library user auth hash and district user auth hash
      clever_id: hash[:clever_id] || hash[:id],
      name: hash[:name],
      role: 'teacher'
    )
    teacher
  end
end
