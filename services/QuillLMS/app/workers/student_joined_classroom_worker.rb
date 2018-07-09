class StudentJoinedClassroomWorker
  include Sidekiq::Worker

  def perform(teacher_id, student_id)
    teacher = User.find(teacher_id)
    student = User.find(student_id)

    # do in following order so we identify the teacher last
    analytics = Analyzer.new
    analytics.track_with_attributes(
      student,
      SegmentIo::Events::STUDENT_ACCOUNT_CREATION,
      {
        context: {:ip => student.ip_address },
        integrations: { intercom: 'false' }
      })
    analytics.track(teacher, SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION)
  end
end
