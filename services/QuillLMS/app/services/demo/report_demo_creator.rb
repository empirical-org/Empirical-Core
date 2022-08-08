# frozen_string_literal: true

module Demo::ReportDemoCreator

  EVIDENCE_APP_SETTING = "comprehension"
  REPLAYED_ACTIVITY_ID = 434
  REPLAYED_SAMPLE_USER_ID = 312664
  ACTIVITY_PACKS_TEMPLATES = [
    {
      name: "Quill Activity Pack",
      activity_ids: [1663, 437, 434, 215, 41, 386, 289, 295, 418],
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
      activity_ids: [851, 863, 861, 985, 986, 1446],
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
      activity_ids: [627, 628, 629, 535, 523],
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
      activity_ids: [742, 751, 765],
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
      activity_ids: [1664],
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
      activity_ids: [1726, 1815, 1813, 1830],
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

  def self.create_demo(email)
    teacher = create_teacher(email)
    classroom = create_classroom(teacher)
    students = create_students(classroom, !email) # using the presence of a passed email to determine whether this is the standard /demo account or not
    units = create_units(teacher)
    classroom_units = create_classroom_units(classroom, units)
    activity_sessions = create_activity_sessions(students, classroom)
    subscription = create_subscription(teacher)
    create_replayed_activity_session(students.first, classroom_units.first)

    TeacherActivityFeedRefillWorker.perform_async(teacher.id)
  end

  def self.create_teacher(email)
    email ||= "hello+demoteacher@quill.org"

    existing_teacher = User.find_by_email(email)
    existing_teacher.destroy if existing_teacher

    values = {
      name: "Demo Teacher",
      email: email,
      role: "teacher",
      password: 'password',
      password_confirmation: 'password',
      flags: ["beta"]
    }

    teacher = User.create(values)
    app_setting = AppSetting.find_by(name: EVIDENCE_APP_SETTING)

    return teacher if app_setting.blank?

    app_setting.user_ids_allow_list << teacher.id
    app_setting.save
    teacher
  end

  def self.create_classroom(teacher)
    values = {
      name: "Quill Classroom",
      code: "demo-#{teacher.id}",
      grade: '9'
    }
    classroom = Classroom.create_with_join(values, teacher.id)
  end

  def self.create_units(teacher)
    units = []
    ACTIVITY_PACKS_TEMPLATES.each do |ap|
      unit = Unit.create({name: ap[:name], user: teacher})
      ap[:activity_ids].each { |act_id| UnitActivity.create({activity_id: act_id, unit: unit}) }
      units.push(unit)
    end
    units
  end

  def self.create_subscription(teacher)
    attributes = {
      purchaser_id: teacher.id,
      account_type: 'Teacher Trial'
    }
    Subscription.create_and_attach_subscriber(attributes, teacher)
  end

  def self.create_students(classroom, is_teacher_facing_demo_account)
    students = []
    student_values = [
      {
        name: "Ken Liu",
        username: "ken.liu.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "Jason Reynolds",
        username: "jason.reynolds.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "Nic Stone",
        username: "nic.stone.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "Tahereh Mafi",
        username: "tahereh.mafi.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "Angie Thomas",
        username: "angie.thomas.#{classroom.id}@demo-teacher",
        role: "student",
        email: is_teacher_facing_demo_account ? 'angie_thomas_demo@quill.org' : nil, # we only want to generate this account with the email linked to quill.org/student_demo if this is the standard quill.org/demo account
        password: 'password',
        password_confirmation: 'password'
      }
    ]

    if is_teacher_facing_demo_account
      # In case the old one didn't get deleted, delete Angie Thomas so that we
      # won't raise a validation error.
      # This is important as we have /student_demo set to go to the Angie Thomas email
      User.where(email: 'angie_thomas_demo@quill.org').each(&:destroy)
    end

    student_values.each do |values|
      student = User.create(values)
      StudentsClassrooms.create({student_id: student.id, classroom_id: classroom.id})
      students.push(student)
    end
    students
  end

  def self.create_classroom_units(classroom, units)
    units.map do |unit|
      ClassroomUnit.create(
        classroom: classroom,
        unit: unit,
        assign_on_join: true)
    end
  end

  def self.create_replayed_activity_session(student, classroom_unit)
    replayed_session = ActivitySession.unscoped.where({activity_id: REPLAYED_ACTIVITY_ID, user_id: REPLAYED_SAMPLE_USER_ID, is_final_score: true}).first
    student_id = student.id
    act_session = ActivitySession.create({activity_id: REPLAYED_ACTIVITY_ID, classroom_unit_id: classroom_unit.id, user_id: student.id, state: "finished", percentage: replayed_session&.percentage})
    replayed_session&.old_concept_results&.each do |cr|
      values = {
        activity_session_id: act_session.id,
        concept_id: cr.concept_id,
        metadata: cr.metadata,
        question_type: cr.question_type
      }
      old_concept_result = OldConceptResult.create(values)
      SaveActivitySessionConceptResultsWorker.perform_async([old_concept_result.id]) if old_concept_result
    end
  end

  def self.create_activity_sessions(students, classroom)

    students.each_with_index do |student, num|
      ACTIVITY_PACKS_TEMPLATES.each do |activity_pack|
        unit = Unit.where(name: activity_pack[:name]).last
        act_sessions = activity_pack[:activity_sessions]
        act_sessions[num].each do |act_id, user_id|
          temp = ActivitySession.unscoped.where({activity_id: act_id, user_id: user_id, is_final_score: true}).first
          next unless temp

          cu = ClassroomUnit.find_by(classroom_id: classroom.id, unit_id: unit.id)
          act_session = ActivitySession.create({activity_id: act_id, classroom_unit_id: cu.id, user_id: student.id, state: "finished", percentage: temp.percentage})

          temp.old_concept_results.each do |cr|
            values = {
              activity_session_id: act_session.id,
              concept_id: cr.concept_id,
              metadata: cr.metadata,
              question_type: cr.question_type
            }
            old_concept_result = OldConceptResult.create(values)
            SaveActivitySessionConceptResultsWorker.perform_async([old_concept_result.id]) if old_concept_result
          end
        end
      end
    end
  end
end
