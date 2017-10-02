class PremiumAnalyticsWorker
  include Sidekiq::Worker

  def perform(id, account_type)
    @user = User.find(id)
    if account_type == 'paid'
      analytics = BeganPremiumAnalytics.new
    else
      # this is a a bit of a misnomer as free-contributor and free low-income
      # go here as well
      analytics = BeganTrialAnalytics.new
    end
    # tell segment.io
    analytics.track(@user)
  end
end
