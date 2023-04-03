# frozen_string_literal: true

class Demo::CreateAdminReport

  def initialize(teacher_email)
    @teacher_email = teacher_email
  end

  def call
    create_demo
  end

  attr_reader :teacher_email
  private :teacher_email

  private def find_or_create_school(school_name)
    School.find_or_create_by(name: school_name)
  end

  private def find_or_create_teacher_data(teacher_name, school, subscription)
    email_safe_last_name = teacher_name.split.last.downcase.gsub(/[^a-zA-Z\d]/, '').gsub(/\s/, '')
    user = User.find_or_initialize_by(
      name: teacher_name,
      email: "hello+admindemo-#{email_safe_last_name}.#{school.id}@quill.org",
    )
    user.update(password: SecureRandom.urlsafe_base64, role: User::TEACHER)

    SchoolsUsers.find_or_create_by(school: school, user: user)
    UserSubscription.create!(user_id: user.id, subscription: subscription)

    user
  end

  private def create_demo
    # Create admin teacher
    admin_teacher = User.create!(
      name: 'Toni Morrison',
      role: User::ADMIN,
      email: teacher_email,
      username: '',
      password: SecureRandom.urlsafe_base64
    )
    subscription = Subscription.create!(purchaser_id: admin_teacher.id, account_type: 'Demo Premium', expiration: Date.current + 100.years)

    all_classrooms = []

    data.map do |row|
      # create school data
      school = find_or_create_school(row['School'])
      SchoolsAdmins.find_or_create_by!(school: school, user: admin_teacher)
      SchoolSubscription.find_or_create_by!(subscription: subscription, school: school)

      # create teacher data
      teacher = find_or_create_teacher_data(row['Teacher'], school, subscription)

      # create classroom data
      classroom = Classroom.create(name: row['Classroom'])
      all_classrooms.push(classroom)
      ClassroomsTeacher.create(classroom: classroom, user: teacher, role: ClassroomsTeacher::ROLE_TYPES[:owner])
      student_names = (1..5).to_a.map { |i| "#{Faker::Name.first_name} #{Faker::Name.last_name}" }
      Demo::ReportDemoCreator.create_demo_classroom_data(teacher, teacher_demo: false, classroom: classroom, student_names: student_names)
    end

    # delete some activity sessions to make data more varied
    all_classrooms.sample(20).each do |classroom|
      activity_sessions_for_classroom = ActivitySession.joins(:classroom_unit).where('classroom_units.classroom_id = ?', classroom.id)
      number_of_sessions_to_destroy = (14..28).to_a.sample # 10-20% of 140
      activity_sessions_for_classroom.sample(number_of_sessions_to_destroy).each { |as| as.destroy }
    end
  end

  def data
    @data ||= Demo::SessionData.new.admin_demo_data
  end
end
