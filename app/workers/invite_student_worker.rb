class InviteStudentWorker
  include Sidekiq::Worker

  def perform(teacher_id, student_id)
    teacher = User.find(teacher_id)
    student = User.find(student_id)

    analytics = InviteStudentAnalytics.new
    analytics.track(teacher, student)
  end
end
