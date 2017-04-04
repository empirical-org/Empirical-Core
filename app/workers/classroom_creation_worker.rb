class ClassroomCreationWorker
  include Sidekiq::Worker

  def perform(classroom_id)
    classroom = Classroom.unscoped.find_by_id(classroom_id)
    if classroom
      analytics = SegmentAnalytics.new
      analytics.track_classroom_creation(classroom)
    end
  end
end
