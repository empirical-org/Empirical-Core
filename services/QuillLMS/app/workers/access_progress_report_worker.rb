# frozen_string_literal: true

class AccessProgressReportWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = Analyzer.new
    analytics.track(@user, SegmentIo::BackgroundEvents::ACCESS_PROGRESS_REPORT)
  end
end
