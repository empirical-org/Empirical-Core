class JoinClassroomWorker
  include Sidekiq::Worker
  

  def perform(id)
    @user = User.find(id)
    # tell segment.io
    analytics = JoinClassroomAnalytics.new
    analytics.track(@user)
  end
end
