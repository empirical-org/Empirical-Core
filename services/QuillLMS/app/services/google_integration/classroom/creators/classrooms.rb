module GoogleIntegration::Classroom::Creators::Classrooms

  def self.run(teacher, courses)
    courses.map{ |course| create_classroom(teacher, course) }
           .compact
  end

  def self.create_classroom(teacher, course)
    classroom = ::Classroom.unscoped.find_or_initialize_by(google_classroom_id: course[:id], teacher_id: teacher.id)
      if classroom.new_record?
        classroom.attributes = {name: course[:name] || "Classroom #{course[:id]}", teacher_id: teacher.id}
        classroom.save!
        ClassroomsTeacher.create(classroom: classroom, user: teacher, role: 'owner')
      end
      classroom.update(grade: course[:grade], visible: true)
      classroom.reload
    classroom
  end

end
