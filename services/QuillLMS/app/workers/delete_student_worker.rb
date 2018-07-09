class DeleteStudentWorker
  include Sidekiq::Worker

  def perform(teacher_id, referred_from_class_path)
    teacher = User.find(teacher_id)
    analytics = Analyzer.new
    if referred_from_class_path
      event = SegmentIo::Events::TEACHER_DELETED_STUDENT_ACCOUNT
    else
      event = SegmentIo::Events::MYSTERY_STUDENT_DELETION
    end
    # tell segment.io
    analytics.track(teacher, event)
  end
end
