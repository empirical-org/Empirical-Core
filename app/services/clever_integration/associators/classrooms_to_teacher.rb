module CleverIntegration::Associators::ClassroomsToTeacher

  def self.run(classrooms, teacher)
    updated_classrooms = classrooms.map do |classroom|
      ClassroomsTeacher.find_or_create_by(classroom: classroom, user: teacher, role: 'owner')
      classroom.update(teacher_id: teacher.id)
      classroom.reload
    end
    updated_classrooms
  end
end
