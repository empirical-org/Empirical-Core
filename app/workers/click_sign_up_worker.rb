class ClickSignUpWorker
  include Sidekiq::Worker

  def perform
    analytics = SegmentAnalytics.new
    analytics.track_click_sign_up
  end
end