# require 'report_demo_destroyer'
# require 'report_demo_creator'
#
# include ReportDemoCreator
# include ReportDemoDestroyer

namespace :report_demo do
  desc 'make report demo accounts'
  task :create, [:name] => :environment do |t, args|
    # call this with no arguments if you want quill.org/demo to be created. otherwise
    # to use this call rake report_demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    Demo::ReportDemoCreator::create_demo(name)
  end

  task :destroy, [:name] => :environment do |t, args|
    # to use this call rake demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    Demo::ReportDemoDestroyer::destroy_demo(name)
  end

  task :create_admin, [:name] => :environment do |t, args|
    # Find or create demo school
    name = args[:name]
    school = School.create!(name: name)
    email_safe_school_name = name.gsub(/^a-zA-Z\d/, '').gsub(/\s/, '')

    # Create admin teacher
    admin_teacher = User.create!(
      name: 'Admin Teacher',
      role: 'teacher',
      email: "hello+demoadmin-#{email_safe_school_name}@quill.org",
      username: '',
      password: SecureRandom.urlsafe_base64
    )

    # Add admin teacher to school as a teacher and an admin
    SchoolsUsers.create!(school_id: school.id, user_id: admin_teacher.id)
    SchoolsAdmins.create!(school_id: school.id, user_id: admin_teacher.id)

    # Find or create a few other teachers
    teachers = ['Ernest Hemingway', 'Jane Austen', 'Franz Kafka']
    teachers = teachers.map do |teacher|
      User.create!(
        name: teacher,
        role: 'teacher',
        email: "hello+admindemo-#{email_safe_school_name}-#{teacher.split(' ').last.downcase}@quill.org",
        username: '',
        password: SecureRandom.urlsafe_base64
      )
    end

    # Create a bunch of classrooms and classrooms_teachers associations
    classrooms = [
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 1'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 2'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 3'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'English 1'), user: teachers.first).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'ELA 1'), user: teachers.second).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Block One'), user: teachers.last).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Block Two'), user: teachers.last).classroom
    ]

    # What unit templates do we want to base the units off of?
    diagnostic_unit_template = UnitTemplate.find(20)
    using_commas_unit_template = UnitTemplate.find(3)
    commonly_confused_words_unit_template = UnitTemplate.find(4)

    # Add teachers to the school, units to each teacher, and classroom activities to the units
    teachers.each do |teacher|
      SchoolsUsers.create(school_id: school.id, user_id: teacher.id)

      diagnostic_unit = Unit.create!(name: diagnostic_unit_template.name, user_id: teacher.id)
      using_commas_unit = Unit.create!(name: using_commas_unit_template.name, user_id: teacher.id)
      commonly_confused_words_unit = Unit.create!(name: commonly_confused_words_unit_template.name, user_id: teacher.id)

      teacher.classrooms_i_teach.each do |classroom|
        diagnostic_unit_template.activities.to_a.uniq.each do |activity|
          ClassroomActivity.create!(classroom_id: classroom.id, activity_id: activity.id, unit_id: diagnostic_unit.id)
        end
        using_commas_unit_template.activities.to_a.uniq.each do |activity|
          ClassroomActivity.create!(classroom_id: classroom.id, activity_id: activity.id, unit_id: using_commas_unit.id)
        end
        commonly_confused_words_unit_template.activities.to_a.uniq.each do |activity|
          ClassroomActivity.create!(classroom_id: classroom.id, activity_id: activity.id, unit_id: commonly_confused_words_unit.id)
        end
      end
    end

    # List of 70 author names to use for student names
    student_names = ['Dante Alighieri', 'Fyodor Dostoevsky', 'Leo Tolstoy', 'Victor Hugo', 'William Shakespeare',
      'Charles Baudelaire', 'Marcel Proust', 'Giovanni Boccaccio', 'Alexander Pushkin', 'Franz Kafka', 'Anton Chekhov',
      'Umberto Eco', 'J.R.R. Tolkien', 'William Faulkner', 'Arthur Rimbaud', 'Ivan Turgenev', 'Charles Dickens',
      'Maxim Gorky', 'George Orwell', 'Nazim Hikmet', 'Oscar Wilde', 'Lord Byron', 'Thomas Mann', 'Alexandre Dumas',
      'James Joyce', 'Boris Pasternak', 'Pablo Neruda', 'Pierre Beaumarchais', 'Najeeb Mahfouz', 'Ursula LeGuin',
      'Nikolay Gogol', 'Italo Calvino', 'Ernest Hemingway', 'Neil Gaiman', 'Jean Racine', 'Albert Camus',
      'Jean-Paul Sartre', 'Chingiz Aitmatov', 'John Steinbeck', 'Milan Kundera', 'Jules Verne', 'Mark Twain',
      'Francois Rabelais', 'Yasar Kemal', 'Jane Austen', 'Geoffrey Chaucer', 'J.D. Salinger', 'Virginia Woolf',
      'Louis Aragon', 'Herman Melville', 'Alphonse Daudet', 'Mikhail Sholokhov', 'Stefan Zweig', 'Bertolt Brecht',
      'T.S. Eliot', 'John Keats', 'Sabahattin Ali', 'John Fante', 'Isaac Asimov', 'Fitzgerald Scott', 'J.M. Coetzee',
      'Kazuo Ishiguro', 'Hermann Hesse', 'Doris Lessing', 'Salman Rushdie', 'Mario Vargas Llosa', 'Aldous Huxley',
      'Thomas Pynchon', 'H.P. Lovecraft', 'Haruki Murakami']

    # Add students to the classrooms
    classrooms.each_with_index do |classroom, index|
      10.times do |n|
        student_name = student_names[(10 * index) + n]
        student = User.create!(
          role: 'student',
          name: student_name,
          password: 'password',
          username: "#{student_name.downcase.sub(' ', '-')}@#{classroom.code}"
        )
        StudentsClassrooms.create!(student_id: student.id, classroom_id: classroom.id)
      end
    end

    # Add activity sessions and concept results for the students of all but one teacher
    # [admin_teacher, teachers[1], teachers[2]].each do |teacher|
    #
    # end
  end
end
