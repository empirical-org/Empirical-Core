# frozen_string_literal: true

class Demo::CreateAdminReport

  NUMBER_OF_CLASSROOMS_TO_DESTROY_SESSIONS_FOR = 20
  RANGE_OF_NUMBER_OF_SESSIONS_TO_DESTROY = 14..28 # 10-20% of 140

  attr_reader :teacher_email

  def initialize(teacher_email, passed_data=nil)
    @teacher_email = teacher_email
    @passed_data = passed_data
  end

  def call
    create_demo
  end

  def data
    @data ||= @passed_data || Demo::SessionData.new.admin_demo_data
  end

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
    subscription = Subscription.create!(purchaser_id: admin_teacher.id, account_type: Subscription::SCHOOL_DISTRICT_PAID, expiration: Date.current + 100.years)

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
      Demo::ReportDemoCreator.create_demo_classroom_data(teacher, is_teacher_demo: false, classroom: classroom, student_names: student_names)
    end

    # delete some activity sessions to make data more varied
    all_classrooms.sample(NUMBER_OF_CLASSROOMS_TO_DESTROY_SESSIONS_FOR).each do |classroom|
      activity_sessions_for_classroom = ActivitySession.joins(:classroom_unit).where('classroom_units.classroom_id = ?', classroom.id)
      number_of_sessions_to_destroy = (RANGE_OF_NUMBER_OF_SESSIONS_TO_DESTROY).to_a.sample
      activity_sessions_for_classroom.sample(number_of_sessions_to_destroy).each { |as| as.destroy }
    end
  end
end
