namespace :report_demo do
  desc 'make report demo accounts'
  task :create, [:name] => :environment do |t, args|
    # to use this call rake demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    ReportDemoCreator::create_demo
  end

  module ReportDemoCreator

    def self.create_demo
      teacher = self.create_teacher()
      classroom = self.create_classroom(teacher)
      students = self.create_students(classroom)
      unit = self.create_unit(teacher)
      classroom_activities = self.create_classroom_activities(classroom, unit)
      sleep 20
      activity_sessions = self.create_activity_sessions(students)
    end

    def self.create_teacher
      values = {
        name: "Demo Teacher",
        email: "hello+demoteacher@quill.org",
        role: "teacher",
        password: 'password',
        password_confirmation: 'password',
      }
      teacher = User.create(values)
    end

    def self.create_classroom(teacher)
      values = {
        name: "Quill Classroom",
        teacher_id: teacher.id,
        grade: '9'
      }
      classroom = Classroom.create(values)
    end

    def self.create_unit(teacher)
      values = {
        name: "Quill Activty Pack",
        user: teacher,
      }
      unit = Unit.create(values)
    end

    def self.create_students(classroom)
      students = []
      student_values = [
        {
          name: "Maya Angelou",
          username: "maya.angelou.#{classroom.id}@demo-teacher",
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
        }
      ]
      student_values.each do |values|
        student = User.create(values)
        StudentsClassrooms.create({student_id: student.id, classroom_id: classroom.id})
        students.push(student)
      end
      students
    end

    def self.create_classroom_activities(classroom, unit)
      activities = [431, 422, 442, 455, 386, 299, 173, 413]
      classroom_activities = []
      activities.each do |act_id|
        values = {
          activity_id: act_id,
          classroom: classroom,
          unit: unit,
          assigned_student_ids: []
        }
        ca = ClassroomActivity.create(values)
        classroom_activities.push(ca)
      end
      classroom_activities
    end

    def self.create_activity_sessions(students)
      templates = [
        {
          431 => 478663,
          422 => 478581,
          442 => 749853,
          455 => 285767,
          386 => 287898,
          299 => 749733,
          173 => 749859,
          413 => 864040
        },
        {
          431 => 478705,
          422 => 877345,
          442 => 441567,
          455 => 282267,
          386 => 407845,
          299 => 749858,
          173 => 788604,
          413 => 427296
        }
      ]
      students.each_with_index do |student, num|
        student.activity_sessions.each do |act_session|
          lst = templates[num]
          puts "List"
          puts lst
          puts "act"
          # puts act_session, activity_id
          usr = User.find(lst[act_session.activity_id])
          puts usr
          usr.activity_sessions.each do |ast|
            puts ast.attributes
          end
          temp = usr.activity_sessions.where({activity_id: act_session.activity_id, is_final_score: true}).first #ActivitySession.find(tempates[index][act_session.activity_id])
          puts temp
          act_session.update({state: "finished", percentage: temp.percentage})
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

end
