module CleverIntegration::Associators::SchoolToTeacher

  def self.run(school, teacher)
    school.users << teacher unless school.users.include?(teacher)
    school
  end
end