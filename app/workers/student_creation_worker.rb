class StudentCreationWorker
  include Sidekiq::Worker

  def perform(teacher_id, student_id)
    teacher = User.find(teacher_id)
    student = User.find(student_id)

    analytics = SegmentAnalytics.new
    analytics.track_student_creation_by_teacher(teacher, student)
  end
end