module GoogleIntegration::Classroom::Student

  def self.run(user, courses)
    return if courses.empty?
    first_course = courses.first
    classroom = Classroom.find_by(google_classroom_id: first_course[:id])
    return if classroom.nil?
    self.join_classroom_and_assign_activities(user, classroom)
  end

  private

  def self.join_classroom_and_assign_activities(user, classroom)
    user.update(classcode: classroom.code)
    user.reload.assign_classroom_activities
  end
end