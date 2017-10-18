class ReportMilestoneToSegmentWorker
  include Sidekiq::Worker

  def perform(user_id, milestone_name)
    analytics = SegmentAnalytics.new
    user = User.find(user_id)
    analytics.identify(user)
    analytics.track(
      user_id: user_id,
      event: SegmentIo::Events::USER_COMPLETED_MILESTONE,
      context: { ip: user.ip_address},
      properties: {milestone_name: milestone_name}
    )
  end


end
