module GoogleIntegration::Classroom::Student

  def self.run(user, client)
    courses = self.get_courses

    if courses.any?
      first_course = courses.first
      classroom = Classroom.find_by(google_classroom_id: first_course[:id])
      if classroom.present?
        self.join_classroom_and_assign_activities(user, classroom)
      end
    end
  end

  private

  def self.get_courses
    GoogleIntegration::Classroom::GetCourses.run(client)
  end

  def self.join_classroom_and_assign_activities(user, classroom)
    user.update(classcode: classroom.code)
    user.reload.assign_classroom_activities
  end
end