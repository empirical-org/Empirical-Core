module Demo::ReportDemoCreator

  def self.create_demo(name)
    teacher = self.create_teacher(name)
    classroom = self.create_classroom(teacher)
    students = self.create_students(classroom)
    unit = self.create_unit(teacher)
    classroom_activities = self.create_classroom_activities(classroom, unit)
    activity_sessions = self.create_activity_sessions(students)
  end

  def self.create_teacher(name)
    email = name ? "hello+#{name}@quill.org" : "hello+demoteacher@quill.org"
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
        name: "Maya Angelou",
        username: "maya.angelou.#{classroom.id}@demo-teacher",
        role: "student",
        email: 'maya_angelou_demo@quill.org',
        password: 'password',
        password_confirmation: 'password'
      }
    ]
    # In case the old one didn't get deleted, delete Maya Angelou so that we
    # won't raise a validation error.
    # This is important as we have /student set to go to the Maya Angelou email
    User.where(email: 'maya_angelou_demo@quill.org').each(&:destroy)
    student_values.each do |values|
      student = User.create(values)
      StudentsClassrooms.create({student_id: student.id, classroom_id: classroom.id})
      students.push(student)
    end
    students
  end

  def self.create_classroom_activities(classroom, unit)
    activities = [413, 437, 434, 215, 41, 386, 289, 295, 418]
    classroom_activities = []
    activities.each do |act_id|
      values = {
        activity_id: act_id,
        classroom: classroom,
        unit: unit,
        assign_on_join: true
      }
      ca = ClassroomActivity.create(values)
      classroom_activities.push(ca)
    end
    classroom_activities
  end

  def self.create_activity_sessions(students)
    templates = [
      {413 => 657589,
      437 => 313241,
      434 => 446637,
      215 => 369874,
       41 => 438155,
      386 => 387966,
      289 => 442653,
      295 => 442645,
      418 => 662204},


      {413 => 657588,
      437 => 409030,
      434 => 313319,
      215 => 370995,
       41 => 459240,
      386 => 387956,
      289 => 442649,
      295 => 442649,
      418 => 662204},


      {413 => 657593,
      437 => 446637,
      434 => 312664,
      215 => 369875,
       41 => 438144,
      386 => 387967,
      289 => 442670,
      295 => 442638,
      418 => 662204},


      {413 => 657586,
      437 => 312664,
      434 => 313241,
      215 => 369883,
       41 => 438171,
      386 => 387954,
      289 => 442645,
      295 => 442653,
      418 => 662204},


      {413 => 657503,
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
      puts student
      templates[num].each do |act_id, user_id|
        # lst = templates[num]
        # puts "List"
        # puts lst
        # puts "act"
        # puts act_session, activity_id
        # usr = User.find(user_id)
        # puts usr
        # usr.activity_sessions.each do |ast|
        #   puts ast.attributes
        # end
        temp = ActivitySession.unscoped.where({activity_id: act_id, user_id: user_id, is_final_score: true}).first #ActivitySession.find(tempates[index][act_session.activity_id])
        puts temp
        ca = ClassroomActivity.where("#{student.id} = ANY (assigned_student_ids) AND activity_id = #{act_id}").to_a.first
        act_session = ActivitySession.create({activity_id: act_id, classroom_activity_id: ca.id, user_id: student.id, state: "finished", percentage: temp.percentage})
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
