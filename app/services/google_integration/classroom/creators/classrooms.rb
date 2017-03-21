module GoogleIntegration::Classroom::Creators::Classrooms

  def self.run(teacher, courses)
    puts teacher
    courses.map{ |course| self.create_classroom(teacher, course) }
           .compact
  end

  private

  def self.create_classroom(teacher, course)
    if teacher.google_id == course[:ownerId]
      classroom = ::Classroom.unscoped.find_or_initialize_by(google_classroom_id: course[:id], teacher_id: teacher.id)
      if classroom.new_record?
        classroom.attributes = {name: course[:name] || "Classroom #{course[:id]}", teacher_id: teacher.id}
        classroom.save!
      end
      classroom.reload
    end
    classroom
  end

end
