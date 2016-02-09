module GoogleIntegration::Classroom::Student

  def self.run(user, client, course_getter)
    courses = course_getter.run(client)

    if courses.any?
      first_course = courses.first
      classroom = Classroom.find_by(google_classroom_id: first_course[:id])
      if classroom.present?
        self.join_classroom_and_assign_activities(user, classroom)
      end
    end
  end

  private


  def self.join_classroom_and_assign_activities(user, classroom)
    user.update(classcode: classroom.code)
    user.reload.assign_classroom_activities
  end
end