class DeleteStudentWorker
  include Sidekiq::Worker

  def perform(teacher_id, referred_from_class_path)
    teacher = User.find(teacher_id)
    if referred_from_class_path
      analytics = DeleteStudentAnalytics.new
    else
      analytics = MysteryStudentDeletionAnalytics.new
    end
    # tell segment.io
    analytics.track(teacher)
  end
end
