# frozen_string_literal: true

class Demo::CreateAdminReport

  def initialize(name, email_safe_school_name, teacher_email)
    @name = name
    @email_safe_school_name = email_safe_school_name
    @teacher_email = teacher_email
  end

  def call
    create_demo
  end

  attr_reader :name, :email_safe_school_name, :teacher_email
  private :name
  private :email_safe_school_name
  private :teacher_email

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity
  private def create_demo
    # Create the school
    school = School.create!(name: name)

    # Create admin teacher
    admin_teacher = User.create!(
      name: 'Toni Morrison',
      role: 'teacher',
      email: teacher_email,
      username: '',
      password: SecureRandom.urlsafe_base64
    )

    # Add admin teacher to school as an admin
    SchoolsAdmins.create!(school_id: school.id, user_id: admin_teacher.id)

    # Find or create a few other teachers
    teachers = ['Langston Hughes', 'Jane Austen', 'Maya Angelou']
    teachers = teachers.map do |teacher|
      User.create!(
        name: teacher,
        role: 'teacher',
        email: "hello+admindemo-#{email_safe_school_name}-#{teacher.split.last.downcase}@quill.org",
        username: '',
        password: SecureRandom.urlsafe_base64
      )
    end

    teachers << admin_teacher

    # Upgrade everyone to premium
    subscription_id = Subscription.create!(purchaser_id: admin_teacher.id, account_type: 'Demo Premium', expiration: Date.current + 100.years).id
    teachers.each do |teacher|
      UserSubscription.create!(user_id: teacher.id, subscription_id: subscription_id)
    end

    # Create a bunch of classrooms and classrooms_teachers associations
    classrooms = [
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 1'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Period 2'), user: admin_teacher).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'English 1'), user: teachers.first).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'ELA 1'), user: teachers.second).classroom,
      ClassroomsTeacher.create!(role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom: Classroom.create!(name: 'Block One'), user: teachers.third).classroom
    ]

    # Choose some unit templates we want to base the units off of
    # NOTE: if you change the unit templates, please see the note above 'exemplar_activity_sessions' below
    unit_template_ids = [20, 3, 4, 46, 44]
    unit_templates = unit_template_ids.map { |id| UnitTemplate.find(id) }

    # Add teachers to the school, units to each teacher, and classroom units and unit activities to the units
    teachers.each do |teacher|
      SchoolsUsers.create!(school_id: school.id, user_id: teacher.id)
      units = unit_templates.map { |unit_template| Unit.create!(name: unit_template.name, user_id: teacher.id) }
      teacher.classrooms_i_teach.each do |classroom|
        units.each_with_index do |unit, index|
          ClassroomUnit.find_or_create_by(classroom_id: classroom.id, unit_id: unit.id, assign_on_join: true)
          unit_templates[index].activities.to_a.uniq.each do |activity|
            UnitActivity.find_or_create_by(activity_id: activity.id, unit_id: unit.id)
          end
        end
      end
    end

    # List of author names to use for student names
    student_names = [
      "Richard Wright", "Alex Haley", "Ralph Ellison", "Octavia Butler", "Ursula LeGuin",
      "John Steinbeck", "Irvine Welsh", "Mark Twain", "Isaac Asimov", "Salman Rushdie", "Aldous Huxley",
      "George Orwell", "William Shakespeare", "Franz Kafka", "Charles Dickens", "Virginia Woolf",
      "John Keats", "Herman Melville", "Marcel Proust", "Ernest Hemingway", "Pablo Neruda", "Leo Tolstoy",
      "Oscar Wilde", "James Joyce", "Fyodor Dostoevsky", "Umberto Eco", "Albert Camus", "Jules Verne",
      "Fitzgerald Scott", "Dante Alighieri", "Victor Hugo", "Charles Baudelaire", "Giovanni Boccaccio",
      "Alexander Pushkin", "Anton Chekhov", "William Faulkner", "Arthur Rimbaud", "Ivan Turgenev",
      "Maxim Gorky", "Nazim Hikmet", "Lord Byron", "Thomas Mann", "Alexandre Dumas", "Boris Pasternak",
      "Pierre Beaumarchais", "Najeeb Mahfouz", "Nikolay Gogol", "Italo Calvino", "Jean Racine",
      "Chingiz Aitmatov", "Milan Kundera", "Francois Rabelais", "Yasar Kemal", "Geoffrey Chaucer",
      "Louis Aragon", "Alphonse Daudet", "Mikhail Sholokhov", "Stefan Zweig", "Bertolt Brecht",
      "Sabahattin Ali", "John Fante", "Kazuo Ishiguro", "Hermann Hesse", "Doris Lessing",
      "Mario Vargas Llosa", "Thomas Pynchon", "Haruki Murakami", "Saladin Ahmed", "James Baldwin",
      "Jhumpa Lahiri", "Terry McMillan", "Truman Capote", "Toni Morrison", "Junot Diaz", "Zadie Smith",
      "Sherman Alexie", "Langston Hughes", "Amy Tan", "Lorraine Hansberry", "Alice Walker",
      "Isabel Allende", "Sandra Cisneros", "Colson Whitehead", "Khaled Hosseini", "Arundhati Roy",
      "Jacqueline Woodson", "Celeste Ng", "Roxane Gay", "Chinua Achebe", "Nella Larsen",
      "Tennessee Williams", "Gertrude Stein", "Allen Ginsberg", "Audre Lorde", "David Sedaris",
      "Mindy Kaling", "Justin Chin", "Kahlil Gibran", "Eli Wiesel", "Paulo Coelho",
      "Julia Alvarez", "Mo Willems", "George Eliot", "Lois Lowry"
    ].shuffle

    # How many students per class?
    number_of_students_per_class = 5

    # Add students to the classrooms
    classrooms.each_with_index do |classroom, index|
      number_of_students_per_class.times do |n|
        student_name = student_names[(number_of_students_per_class * index) + n]
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
    # NOTE: we manually selected these activity sessions as a representative sample because
    # it would be pretty computationally intensive to select randomly from all of the
    # associated activity sessions. In the event this demo creator for some reason changes,
    # you'll need to update the exemplar activity sessions manually.
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
      273 => [11968758, 10427339, 22435199, 17393608, 13968692, 28949511, 7522721, 9540189],
      571 => [27919823],
      567 => [29001738],
      572 => [28173122]
    }

    # Add activity sessions and concept results for students of all but one teacher
    teachers[1..-1].each do |teacher|
      teacher.students.each do |student|
        teacher.unit_activities.each do |unit_activity|
          we_want_to_create_another_activity_session_for_this_student_and_unit_activity = true
          # We want to ensure that activity 567 shows as in progress for demoing purposes
          the_activity_session_should_be_marked_as_in_progress = unit_activity.activity.id == 567
          classroom_unit = ClassroomUnit.find_by(unit_id: unit_activity.unit_id, classroom_id: [student.classroom_ids])
          while we_want_to_create_another_activity_session_for_this_student_and_unit_activity
            exemplar_activity_session = ActivitySession.unscoped.find(exemplar_activity_sessions[unit_activity.activity_id].sample)
            activity_session = ActivitySession.create!(
              classroom_unit: classroom_unit,
              user_id: student.id,
              activity_id: unit_activity.activity_id,
              state: the_activity_session_should_be_marked_as_in_progress ? 'started' : 'finished',
              percentage: exemplar_activity_session.percentage,
            )
            exemplar_activity_session.concept_results.each do |cr|
              SaveActivitySessionConceptResultsWorker.perform_async({
                activity_session_id: activity_session.id,
                concept_id: cr.concept_id,
                metadata: cr.legacy_format[:metadata],
                question_type: cr.question_type
              })
            end
            we_want_to_create_another_activity_session_for_this_student_and_unit_activity = false
            # diagnostics and lessons cannot be repeated
            this_activity_can_be_repeated = ![4, 6].include?(unit_activity.activity.activity_classification_id)
            # we want to show that some of these activities have been attempted more than once
            if this_activity_can_be_repeated && !the_activity_session_should_be_marked_as_in_progress
              we_want_to_create_another_activity_session_for_this_student_and_unit_activity = true if Random.rand <= 0.25
              the_activity_session_should_be_marked_as_in_progress = true if Random.rand <= 0.25
            end
          end
        end
      end
    end

    admin_teacher
  end
  # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity
end
