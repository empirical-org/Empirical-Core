class DeleteStudentWorker
  include Sidekiq::Worker

  def perform(teacher_id, referred_from_class_path)
    teacher = User.find(teacher_id)
    analytics = DeleteStudentAnalytics.new
    analytics.track(teacher, referred_from_class_path)
  end
end
