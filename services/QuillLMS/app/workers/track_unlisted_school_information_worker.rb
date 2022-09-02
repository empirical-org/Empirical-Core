# frozen_string_literal: true

class TrackUnlistedSchoolInformationWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(user_id, school_name, school_zipcode)
    analytics = SegmentAnalytics.new
    user = User.find_by_id(user_id)
    
    if user && school_name
      analytics.track_teacher_school_not_listed(user, school_name, school_zipcode)
    end
  end

end
