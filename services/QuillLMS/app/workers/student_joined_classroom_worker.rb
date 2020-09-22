class StudentJoinedClassroomWorker
  include Sidekiq::Worker

  def perform(teacher_id, student_id)
    teacher = User.find_by(id: teacher_id)
    student = User.find_by(id: student_id)

    # do in following order so we identify the teacher last
    analytics = Analyzer.new
    analytics.track_with_attributes(
      student,
      SegmentIo::BackgroundEvents::STUDENT_ACCOUNT_CREATION,
      {
        context: {:ip => student&.ip_address },
        integrations: { intercom: 'false' }
      })
    analytics.track(teacher, SegmentIo::BackgroundEvents::TEACHERS_STUDENT_ACCOUNT_CREATION) if teacher
  end
end
