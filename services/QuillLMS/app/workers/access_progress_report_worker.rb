class AccessProgressReportWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = AccessProgressReportAnalytics.new
    analytics.track(@user)
  end
end
