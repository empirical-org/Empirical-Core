module GoogleIntegration::Classroom::Creators::Classrooms

  def self.run(teacher, courses)
    courses.map{ |course| self.create_classroom(teacher, course) }
           .compact
  end

  private

  def self.create_classroom(teacher, course)
    puts "######"
    puts "Google Course for #{teacher.id}"
    puts course
    puts "######"
    classroom = ::Classroom.unscoped.find_or_initialize_by(google_classroom_id: course[:id])
    if classroom.new_record?
      classroom.attributes = {name: course[:name] || "Classroom #{course[:id]}", teacher_id: teacher.id}
      classroom.save
      puts classroom.attributes
      puts classroom.errors.first
      puts classroom.valid?
    end
    puts "######"
    classroom.reload
  end

end
