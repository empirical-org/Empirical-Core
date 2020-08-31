class DailyStatsEmailJob
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(date)
    UserMailer.daily_stats_email(date).deliver_now!
  end
end
