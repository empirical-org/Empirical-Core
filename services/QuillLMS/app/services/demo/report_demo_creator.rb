# frozen_string_literal: true

module Demo::ReportDemoCreator
  EMAIL = 'hello+demoteacher@quill.org'
  STAFF_DEMO_EMAIL = "hello+demoteacher+staff@quill.org"
  REPLAYED_ACTIVITY_ID = 434
  REPLAYED_SAMPLE_USER_ID = 312664

  STARTER_BASELINE_DIAGNOSTIC_PRE_ACTIVITY_ID = 1663

  ANGIE_ID = 14862320
  NIC_ID = 14862321
  JASON_ID = 14862322
  TAHEREH_ID = 14862323
  KEN_ID = 14862324

  # Use report_demo:generate_new_data to generate new data
  ACTIVITY_PACKS_TEMPLATES = [
    {
      name: 'Starter Baseline Diagnostic (Pre)',
      unit_template_id: 99,
      activity_sessions: [
        {
          STARTER_BASELINE_DIAGNOSTIC_PRE_ACTIVITY_ID => KEN_ID
        },
        {
          STARTER_BASELINE_DIAGNOSTIC_PRE_ACTIVITY_ID => TAHEREH_ID
        },
        {
          STARTER_BASELINE_DIAGNOSTIC_PRE_ACTIVITY_ID => JASON_ID
        },
        {
          STARTER_BASELINE_DIAGNOSTIC_PRE_ACTIVITY_ID => NIC_ID
        },
        {
          STARTER_BASELINE_DIAGNOSTIC_PRE_ACTIVITY_ID => ANGIE_ID
        }
      ]
    },
    {
      name: 'Capitalization (Starter Baseline Recommendation)',
      unit_template_id: 308,
      activity_sessions: [
        {}, # Ken Liu
        {
          886 => TAHEREH_ID,
          887 => TAHEREH_ID,
          801 => TAHEREH_ID,
          885 => TAHEREH_ID,
          804 => TAHEREH_ID,
          181 => TAHEREH_ID,
          802 => TAHEREH_ID
        },
        {}, # Jason Reynolds
        {
          801 => NIC_ID,
          887 => NIC_ID,
          804 => NIC_ID,
          885 => NIC_ID,
          886 => NIC_ID,
          181 => NIC_ID,
          802 => NIC_ID
        },
        {
          804 => ANGIE_ID,
          886 => ANGIE_ID,
          887 => ANGIE_ID,
          801 => ANGIE_ID,
          885 => ANGIE_ID,
          181 => ANGIE_ID,
          802 => ANGIE_ID
        }
      ]
    },
    {
      name: 'Plural and Possessive Nouns (Starter Baseline Recommendation)',
      unit_template_id: 310,
      activity_sessions: [
        {
          1440 => KEN_ID,
          283 => KEN_ID,
          252 => KEN_ID,
          808 => KEN_ID,
          1308 => KEN_ID,
          803 => KEN_ID
        },
        {}, # Tahereh Mafi
        {}, # Jason Reynolds
        {}, # Nic Stone
        {}  # Angie Thomas
      ]
    },
    {
      name: 'Prepositional Phrases (Starter Baseline Recommendation)',
      unit_template_id: 314,
      activity_sessions: [
        {}, # Ken Liu
        {}, # Tahereh Mafi
        {
          846 => JASON_ID,
          600 => JASON_ID,
          712 => JASON_ID,
          599 => JASON_ID,
          765 => JASON_ID
        },
        {}, # Nic Stone
        {}  # Angie Thomas
      ]
    },
    {
      name: 'Starter Growth Diagnostic (Post)',
      unit_template_id: 217,
      activity_sessions: [
        {
          1664 => KEN_ID
        },
        {
          1664 => TAHEREH_ID
        },
        {
          1664 => JASON_ID
        },
        {
          1664 => NIC_ID
        },
        {
          1664 => ANGIE_ID
        }
      ]
    },
    {
      name: 'Reading for Evidence Pack',
      unit_template_id: nil,
      activity_sessions: [
        {
          2371 => KEN_ID,
          2317 => KEN_ID,
          1676 => KEN_ID
        },
        {}, # Tahereh Mafi
        {}, # Jason Reynolds
        {}, # Nic Stone
        {}  # Angie Thomas
      ]
    }
  ]

  StudentTemplate = Struct.new(:name, :email_eligible, keyword_init: true) do
    def username(classroom_id)
      "#{name.downcase.gsub(' ','.')}.#{classroom_id}@demo-teacher"
    end

    def email
      return nil unless email_eligible

      "#{name.downcase.gsub(' ','_')}_demo@quill.org"
    end
  end

  STUDENT_TEMPLATES = [
    StudentTemplate.new(name: 'Ken Liu', email_eligible: false),
    StudentTemplate.new(name: 'Jason Reynolds', email_eligible: false),
    StudentTemplate.new(name: 'Nic Stone', email_eligible: false),
    StudentTemplate.new(name: 'Tahereh Mafi', email_eligible: false),
    StudentTemplate.new(name: 'Angie Thomas', email_eligible: true)
  ]
  PASSWORD = 'password'
  CLASSROOM_NAME = 'Quill Classroom'

  STUDENT_COUNT = STUDENT_TEMPLATES.count
  UNITS_COUNT = ACTIVITY_PACKS_TEMPLATES.count

  def self.create_demo(email = nil, is_teacher_demo: false)
    ActiveRecord::Base.transaction do
      teacher = create_teacher(email)
      create_teacher_info(teacher)
      create_subscription(teacher)
      create_demo_classroom_data(teacher, is_teacher_demo:)
    end
  rescue ActiveRecord::RecordInvalid
    # ignore invalid records
  end

  def self.create_demo_classroom_data(teacher, is_teacher_demo: false, classroom: nil, student_names: nil)
    units = reset_units(teacher, student_names.nil?, is_teacher_demo)

    classroom ||= create_classroom(teacher)

    student_templates = student_names ? student_names.map { |name| StudentTemplate.new(name: name, email_eligible: false) } : STUDENT_TEMPLATES

    students = create_students(classroom, is_teacher_demo, student_templates)

    classroom_units = create_classroom_units(classroom, units)

    session_data = Demo::SessionData.new

    create_activity_sessions(students, classroom, session_data, is_teacher_demo)
    create_replayed_activity_session(students.first, classroom_units.first, session_data)

    TeacherActivityFeedRefillWorker.perform_async(teacher.id)
  end

  def self.reset_units(teacher, destroy_existing_units, is_teacher_demo)
    teacher.units&.destroy_all if destroy_existing_units

    create_units(teacher, is_teacher_demo)
  end

  def self.reset_account(teacher_id)
    teacher = User.teacher.find_by(id: teacher_id)

    return unless teacher

    non_demo_classrooms(teacher).each {|c| c.update(visible: false)}
    teacher.auth_credential&.destroy
    teacher.update(google_id: nil, clever_id: nil)

    reset_demo_classroom_if_needed(teacher_id)
  end

  def self.reset_demo_classroom_if_needed(teacher_id)
    # Wrap the lookup and actions within a transaction to avoid race conditions
    ActiveRecord::Base.transaction do
      teacher = User.teacher.find_by(id: teacher_id)

      # Note, you can't early return within a transaction in Rails 6.1+
      if teacher && demo_classroom_modified?(teacher)
        # mark as invisible and reset class code (since the demo logic uses a specific class code)
        demo_classroom(teacher)&.update(visible: false, code: nil)
        create_demo_classroom_data(teacher, is_teacher_demo: true)
      end
    end
  rescue ActiveRecord::RecordInvalid
    # ignore invalid records
  end

  def self.demo_classroom_modified?(teacher)
    classroom = demo_classroom(teacher)

    return true if classroom.nil? || !classroom.visible

    classroom.name != CLASSROOM_NAME ||
      classroom.students.count != STUDENT_COUNT ||
      classroom.units.count != UNITS_COUNT
  end

  def self.create_teacher(email)
    email ||= EMAIL

    existing_teacher = User.find_by_email(email)
    existing_teacher.destroy if existing_teacher

    User.create(
      name: 'Demo Teacher',
      email: email,
      role: User::TEACHER,
      password: 'password',
      password_confirmation: 'password',
      flags: ['beta']
    )
  end

  def self.create_teacher_info(teacher)
    teacher_info = TeacherInfo.create(user: teacher, minimum_grade_level: 'K', maximum_grade_level: 12)
    TeacherInfoSubjectArea.create(teacher_info: teacher_info, subject_area: SubjectArea.first)
  end

  def self.create_classroom(teacher)
    values = {
      name: 'Quill Classroom',
      code: classcode(teacher.id),
      grade: '9'
    }

    classroom = Classroom.create_with_join(values, teacher.id)

    classroom.save!
    classroom
  end

  def self.classcode(teacher_id)
    "demo-#{teacher_id}"
  end

  def self.demo_classroom(teacher)
    teacher.unscoped_classrooms_i_teach.find {|c| c.code == classcode(teacher.id) }
  end

  def self.non_demo_classrooms(teacher)
    teacher.unscoped_classrooms_i_teach.reject {|c| c.code == classcode(teacher.id) }
  end

  def self.create_units(teacher, is_teacher_demo)
    ACTIVITY_PACKS_TEMPLATES.map do |activity_pack_template|
      # the following line sets the unit template id to nil for the quill_staff_demo account by request of the partnerships team, because they want to be able to assign the starter baseline recommendations
      # and it ensures the unit template actually exists in our database
      unit_template_id = teacher.email === STAFF_DEMO_EMAIL ? nil : UnitTemplate.find_by_id(activity_pack_template[:unit_template_id])&.id
      name = unit_name(activity_pack_template[:name], is_teacher_demo)
      unit = Unit.find_or_create_by(name:, user: teacher, unit_template_id:)
      activity_ids = activity_ids_for_config(activity_pack_template)
      activity_ids.each { |activity_id| UnitActivity.find_or_create_by(activity_id:, unit:) }

      unit
    end
  end

  def self.unit_name(name, is_teacher_demo)
    is_teacher_demo ? name : "#{name} (Demo)"
  end

  def self.activity_ids_for_config(template_hash)
    template_hash[:activity_sessions]
      .map(&:keys)
      .flatten
      .uniq
  end

  def self.create_subscription(teacher)
    attributes = {
      purchaser_id: teacher.id,
      account_type: 'Teacher Trial'
    }
    Subscription.create_and_attach_subscriber(attributes, teacher)
  end

  def self.create_students(classroom, is_teacher_demo, student_templates)
    delete_student_email_accounts if is_teacher_demo

    student_templates.map do |template|
      student = User.create!(
        name: template.name,
        username: template.username(classroom.id),
        role: User::STUDENT,
        email: is_teacher_demo ? template.email : nil,
        password: PASSWORD,
        password_confirmation: PASSWORD
      )
      StudentsClassrooms.create!(student_id: student.id, classroom_id: classroom.id)

      student
    end
  end

  def self.delete_student_email_accounts
    # In case the old one didn't get deleted, delete Angie Thomas so that we
    # won't raise a validation error.
    # This is important as we have /student_demo set to go to the Angie Thomas email
    STUDENT_TEMPLATES
      .select {|template| template.email_eligible }
      .reject {|template| template.email.nil? }
      .each {|template| User.find_by(email: template.email)&.destroy }
  end

  def self.create_classroom_units(classroom, units)
    units.map do |unit|
      ClassroomUnit.create!(
        classroom: classroom,
        unit: unit,
        assign_on_join: true)
    end
  end

  def self.create_replayed_activity_session(student, classroom_unit, session_data)
    clone_activity_session(student.id, classroom_unit.id, REPLAYED_SAMPLE_USER_ID, REPLAYED_ACTIVITY_ID, session_data)
  end

  def self.clone_activity_session(student_id, classroom_unit_id, clone_user_id, clone_activity_id, session_data)
    session_to_clone = session_data.activity_sessions
      .find {|session| session.activity_id == clone_activity_id && session.user_id == clone_user_id}

    return unless session_to_clone

    act_session = ActivitySession.create!(activity_id: clone_activity_id, classroom_unit_id: classroom_unit_id, user_id: student_id, state: 'finished', percentage: session_to_clone.percentage)
    concept_results = session_data.concept_results.select {|cr| cr.activity_session_id == session_to_clone.id }
    concept_results.each do |cr|
      question_type = session_data.concept_result_question_types.first {|qt| qt.id == cr.concept_result_question_type_id}
      SaveActivitySessionConceptResultsWorker.perform_async({
        activity_session_id: act_session.id,
        concept_id: cr.concept_id,
        metadata: session_data.concept_result_legacy_metadata[cr.id],
        question_type: question_type&.text
      })
    end
  end

  def self.create_activity_sessions(students, classroom, session_data, is_teacher_demo)
    students.each_with_index do |student, num|
      ACTIVITY_PACKS_TEMPLATES.each do |activity_pack|
        name = unit_name(activity_pack[:name], is_teacher_demo)
        unit = Unit.where(name:, user: classroom.owner).last
        classroom_unit = ClassroomUnit.find_by(classroom: classroom, unit: unit)

        # Calculate the index for activity_sessions using modulo
        # This will cycle through the activity_sessions for more students
        activity_sessions_index = num % activity_pack[:activity_sessions].length

        activity_sessions = activity_pack[:activity_sessions]
        activity_sessions[activity_sessions_index].each do |clone_activity_id, clone_user_id|
          clone_activity_session(
            student.id,
            classroom_unit.id,
            clone_user_id,
            clone_activity_id,
            session_data
          )
        end
      end
    end
  end
end
