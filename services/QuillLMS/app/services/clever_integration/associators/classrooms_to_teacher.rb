module CleverIntegration::Associators::ClassroomsToTeacher

  def self.run(classrooms, teacher)
    updated_classrooms = classrooms.map do |classroom|
      role = classroom&.owner && classroom&.owner != teacher ? 'coteacher' : 'owner'
      ClassroomsTeacher.find_or_create_by(classroom: classroom, user: teacher, role: role)
      classroom.reload
    end
    updated_classrooms
  end
end
