# frozen_string_literal: true

class ClassroomCreationWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT, retry: false

  def perform(classroom_id)
    classroom = Classroom.unscoped.find_by_id(classroom_id)
    return unless classroom

    analytics = SegmentAnalytics.new
    analytics.track_classroom_creation(classroom)
  end
end
