class JoinClassroomWorker
  include Sidekiq::Worker
  sidekiq_options :retry => 2

  def perform(id)
    @user = User.find(id)

    # tell segment.io
    analytics = JoinClassroomAnalytics.new
    analytics.track(@user)
  end
end
