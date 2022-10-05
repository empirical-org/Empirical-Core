# frozen_string_literal: true

module Demo::ReportDemoCreator

  EMAIL = "hello+demoteacher@quill.org"
  REPLAYED_ACTIVITY_ID = 434
  REPLAYED_SAMPLE_USER_ID = 312664

  ACTIVITY_PACKS_TEMPLATES = [
    {
      name: "Quill Activity Pack",
      activity_sessions: [
        {
          1663 => 9706466,
          437 => 313241,
          434 => 446637,
          215 => 369874,
          41 => 438155,
          386 => 387966,
          289 => 442653,
          295 => 442645,
          418 => 662204
        },
        {
          1663 => 9706465,
          437 => 409030,
          434 => 313319,
          215 => 370995,
          41 => 459240,
          386 => 387956,
          289 => 442649,
          295 => 442649,
          418 => 662204
        },
        {
          1663 => 9706463,
          437 => 446637,
          434 => 312664,
          215 => 369875,
          41 => 438144,
          386 => 387967,
          289 => 442670,
          295 => 442638,
          418 => 662204
        },
        {
          1663 => 9962415,
          437 => 312664,
          434 => 313241,
          215 => 369883,
          41 => 438171,
          386 => 387954,
          289 => 442645,
          295 => 442653,
          418 => 662204
        },
        {
          1663 => 9962377,
          437 => 446641,
          434 => 446641,
          215 => 369872,
          41 => 438152,
          386 => 387948,
          289 => 442656,
          295 => 442643,
          418 => 662204
        }
      ]
    },
    {
      name: "Paragraph Transitions",
      activity_sessions: [
        {
          851 => 9962415,
          863 => 9962415,
          861 => 9962415,
          985 => 9962415,
          986 => 9962415,
          1446 => 9962415
        },
        {
          851 => 9706466,
          863 => 9706466,
          861 => 9706466,
          985 => 9706466,
          986 => 9706466,
          1446 => 9706466
        },
        {
          851 => 9706464,
          863 => 9706464,
          861 => 9706464,
          985 => 9706464,
          986 => 9706464,
          1446 => 9706464
        },
        {
          851 => 9706465,
          863 => 9706465,
          861 => 9706465,
          985 => 9706465,
          986 => 9706465,
          1446 => 9706465
        },
        {
          851 => 9962377,
          863 => 9962377,
          861 => 9962377,
          985 => 9962377,
          986 => 9962377,
          1446 => 9962377
        }
      ]
    },
    {
      name: "Social Studies: Maya, Aztec, and Inca Sentence Combining Practice",
      activity_sessions: [
        {
          627 => 9962415,
          628 =>  9962415,
          629 => 9962415,
          535 => 9962415,
          523 => 9962415
        },
        {
          627 => 9706466,
          628 =>  9706466,
          629 => 9706466,
          535 => 9706466,
          523 => 9706466
        },
        {
          627 => 9706464,
          628 =>  9706464,
          629 => 9706464,
          535 => 9706464,
          523 => 9706464
        },
        {
          627 => 9706465,
          628 =>  9706465,
          629 => 9706465,
          535 => 9706465,
          523 => 9706465
        },
        {
          627 => 9962377,
          628 =>  9962377,
          629 => 9962377,
          535 => 9962377,
          523 => 9962377
        }
      ]
    },
    {
      name: "Subject-Verb Agreement Practice",
      activity_sessions: [
        {
          742 => 9962415,
          751 => 9962415,
          765 => 9962415
        },
        {
          742 => 9706466,
          751 => 9706466,
          765 => 9706466
        },
        {
          742 => 9706464,
          751 => 9706464,
          765 => 9706464
        },
        {
          742 => 9706465,
          751 => 9706465,
          765 => 9706465
        },
        {
          742 => 9962377,
          751 => 9962377,
          765 => 9962377
        }
      ]
    },
    {
      name: "Starter Growth Diagnostic (Post)",
      activity_sessions: [
        {
          1664 => 11662573
        },
        {
          1664 => 9706466
        },
        {
          1664 => 9706464
        },
        {
          1664 => 9706465
        },
        {
          1664 => 9962377
        }
      ]
    },
    {
      name: "Evidence-Based Writing: Ethics in Science [Beta]",
      activity_sessions: [
        {
          1726 => 11776892,
          1815 => 11776892,
          1813 => 11776892,
          1830 => 11776892
        },
        {
          1726 => 11776894,
          1815 => 11776894,
          1813 => 11776894,
          1830 => 11776894
        },
        {
          1726 => 11776893,
          1815 => 11776893,
          1813 => 11776893,
          1830 => 11776893
        },
        {
          1726 => 11776896,
          1815 => 11776896,
          1813 => 11776896,
          1830 => 11776896
        },
        {
          1726 => 11776895,
          1815 => 11776895,
          1813 => 11776895,
          1830 => 11776895
        }
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
    StudentTemplate.new(name: "Ken Liu", email_eligible: false),
    StudentTemplate.new(name: "Jason Reynolds", email_eligible: false),
    StudentTemplate.new(name: "Nic Stone", email_eligible: false),
    StudentTemplate.new(name: "Tahereh Mafi", email_eligible: false),
    StudentTemplate.new(name: "Angie Thomas", email_eligible: true)
  ]
  PASSWORD = 'password'
  CLASSROOM_NAME = "Quill Classroom"

  STUDENT_COUNT = STUDENT_TEMPLATES.count
  UNITS_COUNT = ACTIVITY_PACKS_TEMPLATES.count

  def self.create_demo(email = nil, teacher_demo: false)
    ActiveRecord::Base.transaction do
      teacher = create_teacher(email)
      create_subscription(teacher)
      create_demo_classroom_data(teacher, teacher_demo: teacher_demo)
    end
  rescue ActiveRecord::RecordInvalid
    # ignore invalid records
  end

  def self.create_demo_classroom_data(teacher, teacher_demo: false)
    units = reset_units(teacher)

    classroom = create_classroom(teacher)
    students = create_students(classroom, teacher_demo)

    classroom_units = create_classroom_units(classroom, units)

    session_data = Demo::SessionData.new

    create_activity_sessions(students, classroom, session_data)
    create_replayed_activity_session(students.first, classroom_units.first, session_data)

    TeacherActivityFeedRefillWorker.perform_async(teacher.id)
  end

  def self.reset_units(teacher)
    teacher.units&.destroy_all

    create_units(teacher)
  end

  def self.reset_account(teacher_id)
    teacher = User.find_by(id: teacher_id, role: User::TEACHER)

    return unless teacher

    non_demo_classrooms(teacher).each {|c| c.update(visible: false)}
    teacher.auth_credential&.destroy
    teacher.update(google_id: nil, clever_id: nil)

    # Wrap the lookup and actions within a transaction to avoid race conditions
    ActiveRecord::Base.transaction do
      teacher = User.find_by(id: teacher_id, role: User::TEACHER)
      # Note, you can't early return within a transaction in Rails 6.1+

      if teacher && demo_classroom_modified?(teacher)
        demo_classroom(teacher)&.destroy
        create_demo_classroom_data(teacher, teacher_demo: true)
      end
    end
  rescue ActiveRecord::RecordInvalid
    # ignore invalid records
  end

  def self.demo_classroom_modified?(teacher)
    classroom = demo_classroom(teacher)

    return true if classroom.nil?

    classroom.name != CLASSROOM_NAME ||
      classroom.students.count != STUDENT_COUNT ||
      classroom.units.count != UNITS_COUNT
  end

  def self.create_teacher(email)
    email ||= EMAIL

    existing_teacher = User.find_by_email(email)
    existing_teacher.destroy if existing_teacher

    User.create(
      name: "Demo Teacher",
      email: email,
      role: "teacher",
      password: 'password',
      password_confirmation: 'password',
      flags: ["beta"]
    )
  end

  def self.create_classroom(teacher)
    values = {
      name: "Quill Classroom",
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
    teacher.classrooms_i_teach.find {|c| c.code == classcode(teacher.id) }
  end

  def self.non_demo_classrooms(teacher)
    teacher.classrooms_i_teach.reject {|c| c.code == classcode(teacher.id) }
  end

  def self.create_units(teacher)
    ACTIVITY_PACKS_TEMPLATES.map do |ap|
      unit = Unit.find_or_create_by(name: ap[:name], user: teacher)
      activity_ids = activity_ids_for_config(ap)
      activity_ids.each { |act_id| UnitActivity.find_or_create_by(activity_id: act_id, unit: unit) }

      unit
    end
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

  def self.create_students(classroom, is_teacher_facing)
    delete_student_email_accounts if is_teacher_facing

    STUDENT_TEMPLATES.map do |template|
      student = User.create!(
        name: template.name,
        username: template.username(classroom.id),
        role: User::STUDENT,
        email: is_teacher_facing ? template.email : nil,
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

    act_session = ActivitySession.create!(activity_id: clone_activity_id, classroom_unit_id: classroom_unit_id, user_id: student_id, state: "finished", percentage: session_to_clone.percentage)
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

  def self.create_activity_sessions(students, classroom, session_data)
    students.each_with_index do |student, num|
      ACTIVITY_PACKS_TEMPLATES.each do |activity_pack|
        unit = Unit.where(name: activity_pack[:name]).last
        classroom_unit = ClassroomUnit.find_by(classroom: classroom, unit: unit)
        act_sessions = activity_pack[:activity_sessions]
        act_sessions[num].each do |clone_activity_id, clone_user_id|
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
