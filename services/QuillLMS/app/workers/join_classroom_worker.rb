class JoinClassroomWorker
  include Sidekiq::Worker
  include CheckboxCallback

  def perform(id)
    @user = User.find(id)
    # tell segment.io
    teacher = @user.teacher_of_student
    if teacher.present?
      analytics = Analyzer.new
      analytics.track(teacher, SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION)
    end
  end
end
