class Teachers::ProgressReportsController < ApplicationController
  before_action :authorize!, except: [:demo, :admin_demo]
  # before_action :handle_expired_trial, except: :demo
  before_action :set_vary_header, if: -> { request.xhr? || request.format == :json }
  layout 'progress_reports'

  def demo
    begin
      if params[:name] && params[:name] != ""
        @user = User.find_by_email "hello+#{params[:name]}@quill.org"
        if @user.nil?
          raise NoMethodError
        end
      else
        @user = User.find_by_email 'hello+demoteacher@quill.org'
      end
      sign_in @user
      if params[:name] == 'demoaccount'
        redirect_to teachers_progress_reports_concepts_students_path
      elsif params[:name] == 'admin_demo'
        redirect_to profile_path
      else
        redirect_to scorebook_teachers_classrooms_path
      end
    rescue NoMethodError
      Demo::ReportDemoDestroyer.destroy_demo(params[:name])
      Demo::ReportDemoCreator.create_demo(params[:name])
      if params[:name] && params[:name] != ""
        redirect_to "/demo?name=#{params[:name]}"
      else
        redirect_to "/demo"
      end
    end
  end

  def admin_demo
    # Create demo school
    name = params[:name] || 'Admin Demo School'
    email_safe_school_name = name.gsub(/^a-zA-Z\d/, '').gsub(/\s/, '').downcase
    teacher_email = "hello+demoadmin-#{email_safe_school_name}@quill.org"

    # If this demo account already exists, just go there
    existing_admin_user = User.find_by(email: teacher_email)
    if existing_admin_user.present?
      sign_in existing_admin_user
      return redirect_to teachers_admin_dashboard_path
    end

    # Create the school
    school = School.create!(name: name)

    # Create admin teacher
    admin_teacher = User.create!(
      name: 'Admin Teacher',
      role: 'teacher',
      email: teacher_email,
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

    # Choose some unit templates we want to base the units off of
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

    sign_in admin_teacher
    redirect_to teachers_admin_dashboard_path
  end

  def landing_page
    render 'landing_page'
  end

  def activities_scores_by_classroom
    render 'activities_scores_by_classroom'
  end

  def student_overview
    render 'student_overview'
  end



  private

  # def handle_expired_trial
  #   render :trial_expired if (current_user.premium_state == 'locked')
  # end

  def authorize!
    return if current_user.try(:teacher?)
    auth_failed
  end
end
