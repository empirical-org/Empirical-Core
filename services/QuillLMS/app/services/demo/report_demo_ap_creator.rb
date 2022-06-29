# frozen_string_literal: true

module Demo::ReportDemoAPCreator

  def self.create_demo(name)
    teacher = create_teacher(name)
    create_classrooms_and_populate_units(teacher)
    subscription = create_subscription(teacher)
    TeacherActivityFeedRefillWorker.perform_async(teacher.id)

    teacher
  end

  def self.create_teacher(name)
    email = name ? "hello+#{name}+ap@quill.org" : "hello+demoteacher+ap@quill.org"

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

  def self.create_classrooms_and_populate_units(teacher)
    classrooms = []
    values = [
      {
        classroom: {
          name: "Pre-AP English 1",
          code: "demo-#{teacher.id}-ap1",
          grade: '9'
        },
        unit: "Pre-AP Activity Pack",
        activities: [
          1229,
          770,
          768,
          1203,
          1207,
          429
        ],
        templates: [
          {1229 => 6994359, 770 => 6150478, 768 => 5156541, 1203 => 5616930, 1207 => 5903842, 429 => 6991638 },
          {1229 => 6994359, 770 => 4476914, 768 => 4792565, 1203 => 5616930, 1207 => 6771672, 429 => 1525419},
          {1229 => 6994358, 770 => 2942335, 768 => 4761441, 1203 => 6970110, 1207 => 6757517, 429 => 1525419},
          {1229 => 6994358, 770 => 3192220, 768 => 4567781, 1203 => 4451684, 1207 => 5182963, 429 => 831961},
          {1229 => 6994358, 770 => 4476914, 768 => 4567771, 1203 => 6996453, 1207 => 4957068, 429 => 1899914}
        ]
      },
      {
        classroom: {
          name: "AP English",
          code: "demo-#{teacher.id}-ap",
          grade: '9'
        },
        unit: "AP Activity Pack",
        activities: [
          992,
          853,
          991,
          995,
          442,
          866
        ],
        templates: [
          {992 => 5272317, 853 => 3220353, 991 => 5470323, 995 => 4585548, 442 => 1010496, 866 => 2908343},
          {992 => 5206797, 853 => 3629202, 991 => 3023865, 995 => 4582575, 442 => 865920, 866 => 3077088},
          {992 => 5227752, 853 => 4057678, 991 => 4452927, 995 => 4580403, 442 => 2150672, 866 => 4379056},
          {992 => 5227740, 853 => 4432729, 991 => 4622197, 995 => 4591152, 442 => 866010, 866 => 2991007},
          {992 => 5197215, 853 => 3830517, 991 => 3023865, 995 => 4582575, 442 => 2150671, 866 => 4432346}
        ]
      },
      {
        classroom: {
          name: "ELA 601",
          code: "demo-#{teacher.id}-ela",
          grade: '9'
        },
        unit: "ELA Activity Pack",
        activities: [
          849,
          801,
          271,
          742,
          600,
          33
        ],
        templates: [
          {849 => 3195564, 801 => 4587905, 271 => 346949, 742 => 4404689, 600 => 4055486, 33 => 1921287},
          {849 => 4853561, 801 => 603354, 271 => 3167878, 742 => 2983956, 600 => 2273206, 33 => 1915378},
          {849 => 3195564, 801 => 2833721, 271 => 346950, 742 => 2926568, 600 => 4817125, 33 => 1915390},
          {849 => 4853561, 801 => 2325254, 271 => 346945, 742 => 1942279, 600 => 3855515, 33 => 1742676},
          {849 => 3195564, 801 => 2870716, 271 => 4000979, 742 => 2926611, 600 => 4753754, 33 => 1648758}
        ]
      }
    ]

    values.each do |v|
      classroom = Classroom.create_with_join(v[:classroom], teacher.id)
      classrooms.push(classroom)
      students = create_students(classroom)
      unit = create_unit(teacher, v[:unit])
      create_classroom_units(classroom, unit)
      create_unit_activities(unit, v[:activities])
      create_activity_sessions(students, v[:templates], classroom)
    end

    classrooms
  end

  def self.create_subscription(teacher)
    attributes = {
      purchaser_id: teacher.id,
      account_type: 'Teacher Paid',
      expiration: DateTime.current.next_year(20).to_time
    }
    Subscription.create_and_attach_subscriber(attributes, teacher)
  end

  def self.create_students(classroom)
    students = []
    student_values = [
      {
        name: "William Shakespeare",
        username: "william.shakespeare.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "Harper Lee",
        username: "harper.lee.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "Charles Dickens",
        username: "charles.dickens.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "James Joyce",
        username: "james.joyce.#{classroom.id}@demo-teacher",
        role: "student",
        password: 'password',
        password_confirmation: 'password',
      },
      {
        name: "Bell Hooks",
        username: "bell.hooks.#{classroom.id}@demo-teacher",
        email: 'bell_hooks_demo@quill.org',
        role: "student",
        password: 'password',
        password_confirmation: 'password'
      }
    ]
    student_values.each do |values|
      if values[:email].blank?
        student = User.create(values)
      else
        student = User.find_by(email: values[:email]) || User.create(values)
      end
      students.push(student)
      StudentsClassrooms.create({student_id: student.id, classroom_id: classroom.id})
    end
    students
  end

  def self.create_unit(teacher, unit_name)
    values = {
      name: unit_name,
      user: teacher,
    }
    unit = Unit.create(values)
  end

  def self.create_classroom_units(classroom, unit)
    ClassroomUnit.create(
        classroom: classroom,
        unit: unit,
        assign_on_join: true)
  end

  def self.create_unit_activities(unit, activities)
    activities.each do |act_id|
      values = {
        activity_id: act_id,
        unit: unit,
      }
      ua = UnitActivity.create(values)
    end
  end

  def self.create_activity_sessions(students, templates, classroom)
    students.each_with_index do |student, num|
      templates[num].each do |act_id, user_id|
        temp = ActivitySession.unscoped.where({activity_id: act_id, user_id: user_id, is_final_score: true}).first
        next unless temp

        cu = ClassroomUnit.where("#{student.id} = ANY (assigned_student_ids) AND classroom_id=#{classroom.id}").first
        act_session = ActivitySession.create({activity_id: act_id, classroom_unit_id: cu.id, user_id: student.id, state: "finished", percentage: temp.percentage})
        temp.concept_results.each do |cr|
          values = {
            activity_session_id: act_session.id,
            concept_id: cr.concept_id,
            metadata: cr.metadata,
            question_type: cr.question_type
          }
          OldConceptResult.create(values)
        end
      end
    end
  end
end
