module GoogleIntegration::Classroom::Creators::Classrooms

  def self.run(teacher, courses)
    puts teacher
    courses.map{ |course| self.create_classroom(teacher, course) }
           .compact
  end

  private

  def self.create_classroom(teacher, course)
    puts course
    puts 'here is the create_classroom course'
    puts 'teacher.google_id == course[:ownerId]'
    puts teacher.google_id == course[:ownerId]
    if teacher.google_id == course[:ownerId]
      classroom = ::Classroom.unscoped.find_or_initialize_by(google_classroom_id: course[:id], teacher_id: teacher.id)
      puts 'is classroom new record?'
      puts classroom.new_record?
      if classroom.new_record?
        classroom.attributes = {name: course[:name] || "Classroom #{course[:id]}", teacher_id: teacher.id}
        classroom.save!
      end
      classroom.reload
    end
    puts Classroom.last.name
  end

end
