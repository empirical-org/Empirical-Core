module GoogleIntegration::Classroom::Student

  def self.run(user, courses)
    return if courses.empty?
    first_course = courses.first
    classroom = Classroom.find_by(google_classroom_id: first_course[:id])
    return if classroom.nil?
    self.join_classroom(user, classroom)
  end

  private

  def self.join_classroom(user, classroom)
    Associators::StudentsToClassrooms.run(user, classroom)
  end
end