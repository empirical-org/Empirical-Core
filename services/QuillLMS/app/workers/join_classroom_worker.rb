class JoinClassroomWorker
  include StudentsTeacher
  include Sidekiq::Worker
  include CheckboxCallback

  def perform(id)
    @user = User.find(id)
    # tell segment.io
    teacher = StudentsTeacher.run(@user)
    if teacher.present?
      analytics = Analyzer.new
      analytics.track(teacher, SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION)
    end
  end
end
