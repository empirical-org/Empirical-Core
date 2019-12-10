class DailyStatsEmailJob
  include Sidekiq::Worker

  def perform(date)
    UserMailer.daily_stats_email(date).deliver_now!
  end
end