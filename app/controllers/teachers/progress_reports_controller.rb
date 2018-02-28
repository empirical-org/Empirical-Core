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
      sign_out and sign_in existing_admin_user
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

    # Add admin teacher to school as an admin
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

    teachers << admin_teacher

    # Upgrade everyone to premium
    subscription_id = Subscription.create!(user_id: admin_teacher.id, account_type: 'Demo Premium', expiration: Date.today + 100.years, account_limit: 1000).id
    teachers.each do |teacher|
      UserSubscription.create!(user_id: teacher.id, subscription_id: subscription_id)
    end

    # Create a bunch of classrooms and classrooms_teachers associations
    classrooms = [
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 1'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 2'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 3'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'English 1'), user: teachers.second).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'ELA 1'), user: teachers.third).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Block One'), user: teachers.last).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Block Two'), user: teachers.last).classroom
    ]

    # Choose some unit templates we want to base the units off of
    diagnostic_unit_template = UnitTemplate.find(20)
    using_commas_unit_template = UnitTemplate.find(3)
    commonly_confused_words_unit_template = UnitTemplate.find(4)

    # Add teachers to the school, units to each teacher, and classroom activities to the units
    teachers.each do |teacher|
      SchoolsUsers.create!(school_id: school.id, user_id: teacher.id)

      diagnostic_unit = Unit.create!(name: diagnostic_unit_template.name, user_id: teacher.id)
      using_commas_unit = Unit.create!(name: using_commas_unit_template.name, user_id: teacher.id)
      commonly_confused_words_unit = Unit.create!(name: commonly_confused_words_unit_template.name, user_id: teacher.id)

      teacher.classrooms_i_teach.each do |classroom|
        diagnostic_unit_template.activities.to_a.uniq.each do |activity|
          ClassroomActivity.create!(classroom_id: classroom.id, activity_id: activity.id, unit_id: diagnostic_unit.id, assign_on_join: true)
        end
        using_commas_unit_template.activities.to_a.uniq.each do |activity|
          ClassroomActivity.create!(classroom_id: classroom.id, activity_id: activity.id, unit_id: using_commas_unit.id, assign_on_join: true)
        end
        commonly_confused_words_unit_template.activities.to_a.uniq.each do |activity|
          ClassroomActivity.create!(classroom_id: classroom.id, activity_id: activity.id, unit_id: commonly_confused_words_unit.id, assign_on_join: true)
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

    # Create a map of classroom activity IDs to arrays of exemplar activity sessions to copy
    exemplar_activity_sessions = {
      413 => [26132834, 22674997, 23713760, 14651990, 27055198, 18415812, 22221644, 22513965, 27742073, 22158443],
      182 => [22048631, 27667308, 8907523, 3254361, 1598630, 2019699, 28896968, 3848334, 5927654, 25256514],
      165 => [8655355, 10384565, 7728923, 10888514, 19259048, 27499931, 9244672, 29270571, 17727174],
      177 => [3286331, 2598862, 11393817, 21106096, 2304963, 16243410, 8292121, 4243576, 8390959],
      176 => [3533881, 22299270, 28214093, 16169337, 2050344, 12575685, 10083611, 4728267],
       63 => [6162798, 2781282, 7898538, 10039303, 12346263, 27200543, 17472092, 26083226, 7767661],
       69 => [3421136, 14719539, 2306053, 8839785, 18159027, 27889910, 15582813, 123324],
      168 => [27525129, 11107977, 13452776, 4781007, 18059935, 8594742, 22460531, 11026672],
       77 => [22928913, 20999382, 5844732, 21162049, 9756885, 3139148, 22098329, 9906747, 9605560],
      169 => [12499260, 8594352, 27781517, 20855319, 27675646, 23610692, 27357322, 6146957, 3927662],
      107 => [23198318, 8985748, 6874550, 5612963, 28221047, 13513371, 28530677, 19281636],
      113 => [7247763, 7201638, 6971429, 28153116, 15667648, 4759171, 6874847, 13623922, 23351585],
      111 => [4412433, 7641405, 29133289, 28226170, 28738913, 1416021, 10071820, 28921073],
      112 => [3569714, 14067307, 27587029, 17413447, 19843322, 29167975, 2483020, 308392, 2422426],
      110 => [27402978, 3882494, 2972394, 2107590, 22332137, 29308511, 12215419, 14469882],
      108 => [6003924, 2381787, 9059288, 22089450, 9425941, 2289906, 5124950, 10911501],
      109 => [1394227, 13573237, 11777934, 12152451, 6408246, 8968064, 16857416, 21841339],
      273 => [11968758, 10427339, 22435199, 17393608, 13968692, 28949511, 7522721, 9540189]
    }

    # Add activity sessions and concept results for students of all but one teacher
    teachers[1..-1].each do |teacher|
      teacher.students.each do |student|
        teacher.classroom_activities.each do |classroom_activity|
          exemplar_activity_session = ActivitySession.unscoped.find(exemplar_activity_sessions[classroom_activity.activity_id].sample)
          activity_session = ActivitySession.create!(
            classroom_activity_id: classroom_activity.id,
            user_id: student.id,
            activity_id: classroom_activity.activity_id,
            state: 'finished',
            percentage: exemplar_activity_session.percentage,
          )
          exemplar_activity_session.concept_results.each do |cr|
            ConceptResult.create!(
              activity_session_id: activity_session.id,
              concept_id: cr.concept_id,
              metadata: cr.metadata,
              question_type: cr.question_type
            )
          end
        end
      end
    end

    sign_out and sign_in admin_teacher
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
