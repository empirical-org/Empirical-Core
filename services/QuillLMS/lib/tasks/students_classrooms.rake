namespace :students_classrooms do
  desc 'give every existing user a classroom based off of the classcode column'

  task :create => :environment do
    create_initial_assocations
  end

  def create_initial_assocations
    puts 'Rake Task Started'
    students = User.where(role: 'student')
    students.each do |s|
      if s.classcode
        classroom = Classroom.find_by_code s.classcode
        StudentsClassrooms.find_or_create_by(student_id: s.id, classroom_id: classroom.id) if classroom
      end
    end
    puts 'Rake Task Completed'
  end

end
