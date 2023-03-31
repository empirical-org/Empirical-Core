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

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity
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
  # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity

  private def data
    @data ||= [
      {"School"=>"MLK Middle School", "Teacher"=>"Angie Cruz", "Classroom"=>"Period 1"},
      {"School"=>"MLK Middle School", "Teacher"=>"James Baldwin", "Classroom"=>"Intro to Poetry"},
      {"School"=>"MLK Middle School", "Teacher"=>"Amy Tan", "Classroom"=>"Period 2"},
      {"School"=>"MLK Middle School", "Teacher"=>"Amy Tan", "Classroom"=>"Period 3"},
      {"School"=>"MLK Middle School", "Teacher"=>"Maya Angelou", "Classroom"=>"Period 1a"},
      {"School"=>"MLK Middle School", "Teacher"=>"Harper Lee", "Classroom"=>"Period 1a"},
      {"School"=>"MLK Middle School", "Teacher"=>"Colson Whitehead", "Classroom"=>"ELA Block 1"},
      {"School"=>"MLK Middle School", "Teacher"=>"Toni Morrison", "Classroom"=>"English AP - Literature"},
      {"School"=>"MLK Middle School", "Teacher"=>"Madeleine L'engle", "Classroom"=>"Period 4"},
      {"School"=>"MLK Middle School", "Teacher"=>"Madeleine L'engle", "Classroom"=>"Period 5"},
      {"School"=>"MLK Middle School", "Teacher"=>"Celeste Ng", "Classroom"=>"English Honors"},
      {"School"=>"MLK Middle School", "Teacher"=>"Celeste Ng", "Classroom"=>"English I"},
      {"School"=>"MLK Middle School", "Teacher"=>"Lorrie Moore", "Classroom"=>"English II - 1a"},
      {"School"=>"MLK Middle School", "Teacher"=>"Lorrie Moore", "Classroom"=>"English II - 2a"},
      {"School"=>"MLK Middle School", "Teacher"=>"Julia Alvarez", "Classroom"=>"Pre-AP"},
      {"School"=>"MLK Middle School", "Teacher"=>"Ta-Nehisi Coates", "Classroom"=>"Intro to Journalism"},
      {"School"=>"MLK Middle School", "Teacher"=>"Jhumpa Lahiri", "Classroom"=>"Short Story Writing"},
      {"School"=>"MLK Middle School", "Teacher"=>"Jhumpa Lahiri", "Classroom"=>"Short Story Writing (Honors)"},
      {"School"=>"MLK Middle School", "Teacher"=>"Zora Neale Hurston", "Classroom"=>"Pre-AP English - 7b"},
      {"School"=>"MLK Middle School", "Teacher"=>"Zora Neale Hurston", "Classroom"=>"Pre-AP English - 8a"},
      {"School"=>"MLK Middle School", "Teacher"=>"N.K. Jemisin", "Classroom"=>"English AP"},
      {"School"=>"MLK Middle School", "Teacher"=>"Nick Hornby", "Classroom"=>"Period 3"},
      {"School"=>"MLK Middle School", "Teacher"=>"Octavia Butler", "Classroom"=>"Creative Writing 1"},
      {"School"=>"MLK Middle School", "Teacher"=>"Octavia Butler", "Classroom"=>"Creative Writing 2"},
      {"School"=>"Douglass High School", "Teacher"=>"Kevin Kwan", "Classroom"=>"Period 4"},
      {"School"=>"Douglass High School", "Teacher"=>"Kevin Kwan", "Classroom"=>"Period 5"},
      {"School"=>"Douglass High School", "Teacher"=>"Bram Stoker", "Classroom"=>"ELA Block 2"},
      {"School"=>"Douglass High School", "Teacher"=>"Emily Acevedo", "Classroom"=>"Period 2"},
      {"School"=>"Douglass High School", "Teacher"=>"Paul Coelho", "Classroom"=>"Humanities 1a"},
      {"School"=>"Douglass High School", "Teacher"=>"Paul Coelho", "Classroom"=>"Humanities 2a"},
      {"School"=>"Douglass High School", "Teacher"=>"George Orwell", "Classroom"=>"Period 8"},
      {"School"=>"Douglass High School", "Teacher"=>"James Joyce", "Classroom"=>"European Literature 7a"},
      {"School"=>"Douglass High School", "Teacher"=>"James Joyce", "Classroom"=>"European Literature 8a"},
      {"School"=>"Douglass High School", "Teacher"=>"Harriet Beecher Stowe", "Classroom"=>"Period 9"},
      {"School"=>"Douglass High School", "Teacher"=>"Ralph Ellison", "Classroom"=>"AP English - Composition"},
      {"School"=>"Douglass High School", "Teacher"=>"Judy Blume", "Classroom"=>"AP English - Composition"},
      {"School"=>"Douglass High School", "Teacher"=>"Zadie Smith", "Classroom"=>"English II - Period 1"},
      {"School"=>"Douglass High School", "Teacher"=>"Zadie Smith", "Classroom"=>"English II - Period 2"},
      {"School"=>"Douglass High School", "Teacher"=>"Marie Shelley", "Classroom"=>"Period 5"},
      {"School"=>"Douglass High School", "Teacher"=>"Margaret Atwood", "Classroom"=>"ELA 1H"},
      {"School"=>"Douglass High School", "Teacher"=>"James McBride", "Classroom"=>"English - Period 6"},
      {"School"=>"Douglass High School", "Teacher"=>"William Shakespeare", "Classroom"=>"Intro to Playwriting"},
      {"School"=>"Douglass High School", "Teacher"=>"Emily Bronte", "Classroom"=>"AP - Literature"},
      {"School"=>"Douglass High School", "Teacher"=>"Jane Austen", "Classroom"=>"Period 2"},
      {"School"=>"Douglass High School", "Teacher"=>"Leigh Bardugo", "Classroom"=>"Period 8"},
      {"School"=>"Douglass High School", "Teacher"=>"Tomi Adeyemi", "Classroom"=>"Period 7"},
      {"School"=>"Douglass High School", "Teacher"=>"Alice Walker", "Classroom"=>"Period 1"},
      {"School"=>"Douglass High School", "Teacher"=>"Sylvia Plath", "Classroom"=>"Period 4"}
    ]
  end
end
