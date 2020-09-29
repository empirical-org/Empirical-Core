module Demo::ReportDemoCreator

  def self.create_demo(name)
    teacher = create_teacher(name)
    classroom = create_classroom(teacher)
    students = create_students(classroom)
    unit = create_unit(teacher)
    classroom_units = create_classroom_units(classroom, unit)
    unit_activities = create_unit_activities(unit)
    activity_sessions = create_activity_sessions(students)
    subscription = create_subscription(teacher)
  end

  def self.create_teacher(name)
    email = name ? "hello+#{name}@quill.org" : "hello+demoteacher@quill.org"

    existing_teacher = User.find_by_email(email)
    existing_teacher.destroy if existing_teacher

    values = {
      name: "Demo Teacher",
      email: email,
      role: "teacher",
      password: 'password',
      password_confirmation: 'password',
    }

    teacher = User.create(values)
  end

  def self.create_classroom(teacher)
    values = {
      name: "Quill Classroom",
      code: "demo-#{teacher.id}",
      grade: '9'
    }
    classroom = Classroom.create_with_join(values, teacher.id)
  end

  def self.create_unit(teacher)
    values = {
      name: "Quill Activity Pack",
      user: teacher,
    }
    unit = Unit.create(values)
  end

  def self.create_subscription(teacher)
    attributes = {
      purchaser_id: teacher.id,
      account_type: 'Teacher Trial'
    }
    Subscription.create_with_user_join(teacher.id, attributes)
  end

  def self.create_students(classroom)
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
        email: 'angie_thomas_demo@quill.org',
        password: 'password',
        password_confirmation: 'password'
      }
    ]
    # In case the old one didn't get deleted, delete Angie Thomas so that we
    # won't raise a validation error.
    # This is important as we have /student set to go to the Angie Thomas email
    User.where(email: 'angie_thomas_demo@quill.org').each(&:destroy)
    student_values.each do |values|
      student = User.create(values)
      StudentsClassrooms.create({student_id: student.id, classroom_id: classroom.id})
      students.push(student)
    end
    students
  end

  def self.create_unit_activities(unit)
    activities = [849, 437, 434, 215, 41, 386, 289, 295, 418]
    unit_activities = []
    activities.each do |act_id|
      values = {
        activity_id: act_id,
        unit: unit,
      }
      ua = UnitActivity.create(values)
      unit_activities.push(ua)
    end
    unit_activities
  end

  def self.create_classroom_units(classroom, unit)
    ClassroomUnit.create(
        classroom: classroom,
        unit: unit,
        assign_on_join: true)
  end

  def self.create_activity_sessions(students)
    templates = [
      {849 => 2949282,
      437 => 313241,
      434 => 446637,
      215 => 369874,
       41 => 438155,
      386 => 387966,
      289 => 442653,
      295 => 442645,
      418 => 662204},


      {849 => 2949340,
      437 => 409030,
      434 => 313319,
      215 => 370995,
       41 => 459240,
      386 => 387956,
      289 => 442649,
      295 => 442649,
      418 => 662204},


      {849 => 2949330,
      437 => 446637,
      434 => 312664,
      215 => 369875,
       41 => 438144,
      386 => 387967,
      289 => 442670,
      295 => 442638,
      418 => 662204},


      {849 => 2949353,
      437 => 312664,
      434 => 313241,
      215 => 369883,
       41 => 438171,
      386 => 387954,
      289 => 442645,
      295 => 442653,
      418 => 662204},

      {849 => 3050346,
      437 => 446641,
      434 => 446641,
      215 => 369872,
       41 => 438152,
      386 => 387948,
      289 => 442656,
      295 => 442643,
      418 => 662204}
    ]

    students.each_with_index do |student, num|
      templates[num].each do |act_id, user_id|
        temp = ActivitySession.unscoped.where({activity_id: act_id, user_id: user_id, is_final_score: true}).first
        next unless temp
        cu = ClassroomUnit.where("#{student.id} = ANY (assigned_student_ids)").to_a.first
        act_session = ActivitySession.create({activity_id: act_id, classroom_unit_id: cu.id, user_id: student.id, state: "finished", percentage: temp.percentage})
        temp.concept_results.each do |cr|
          values = {
            activity_session_id: act_session.id,
            concept_id: cr.concept_id,
            metadata: cr.metadata,
            question_type: cr.question_type
          }
          ConceptResult.create(values)
        end
      end
    end
  end
end
