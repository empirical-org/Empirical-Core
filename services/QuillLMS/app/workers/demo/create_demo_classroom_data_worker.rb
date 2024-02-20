# frozen_string_literal: true

class Demo::CreateDemoClassroomDataWorker
  include Sidekiq::Worker

  def perform(teacher_id, is_teacher_demo, classroom_id, student_names)
    teacher = User.find_by_id(teacher_id)
    classroom = Classroom.find_by_id(classroom_id)
    Demo::ReportDemoCreator.create_demo_classroom_data(teacher, is_teacher_demo:, classroom: classroom, student_names: student_names)
  end
end
