class DailyStatsEmailJob
  include Sidekiq::Worker

  def perform
    UserMailer.daily_stats_email.deliver_now!
  end
end