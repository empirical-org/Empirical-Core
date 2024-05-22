# frozen_string_literal: true

class AccessProgressReportWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = Analytics::Analyzer.new
    analytics.track(@user, Analytics::SegmentIo::BackgroundEvents::ACCESS_PROGRESS_REPORT)
  end
end
