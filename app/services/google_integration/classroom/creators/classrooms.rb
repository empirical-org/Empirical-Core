module GoogleIntegration::Classroom::Creators::Classrooms

  def self.run(teacher, courses)
    courses.map{ |course| self.create_classroom(teacher, course) }
           .compact
  end

  private

  def self.create_classroom(teacher, course)
    classroom = ::Classroom.find_or_initialize_by(google_classroom_id: course[:id])
    return nil if not classroom.new_record?
    classroom.attributes = {name: course[:name], teacher_id: teacher.id}
    classroom.save
    classroom.reload
  end

end