module CleverIntegration::Creators::Teacher

  def self.run(hash)
    puts "## 3214: Clever Details"
    puts hash
    teacher = User.find_or_initialize_by(email: hash[:email])
    teacher.update(
      clever_id: hash[:clever_id],
      name: hash[:name],
      role: 'teacher'
    )
    teacher.reload
  end
end
