class PremiumAnaltyicsWorker
  include Sidekiq::Worker

  def perform(id, account_type)
    @user = User.find(id)
    if account_type == 'trial'
      analytics = BeganTrialAnalytics.new
    elsif account_type == 'paid'
      analytics = BeganPremiumAnalytics.new
    end
    # tell segment.io
    analytics.track(@user)
  end
end
