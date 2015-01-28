class ClassroomCreationWorker
  include Sidekiq::Worker

  def perform(classroom_id)
    classroom = Classroom.find(classroom_id)

    analytics = SegmentAnalytics.new
    analytics.track_classroom_creation(classroom)
  end
end